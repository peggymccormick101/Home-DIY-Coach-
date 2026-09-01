from datetime import date, timedelta

import anthropic
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import ai, images, models, schemas
from app.database import get_db

router = APIRouter(prefix="/api/projects", tags=["projects"])


def _build_project_context(project: models.Project) -> str:
    lines = [
        f"Project name: {project.name}",
        f"Original idea/description: {project.description}",
        f"Budget: ${project.budget_usd:,.2f}",
        f"Target finish date: {project.target_date or 'not specified'}",
        f"Summary: {project.summary or 'n/a'}",
        f"Estimated total cost: ${project.estimated_total_cost_usd or 0:,.2f}",
        f"Estimated duration: {project.estimated_duration_days or 'n/a'} days",
        f"Budget notes: {project.budget_notes or 'n/a'}",
        "Tasks:",
    ]
    for t in project.tasks:
        lines.append(f"  {t.order_index + 1}. {t.title} - {t.description}")
    lines.append("Shopping list:")
    for m in project.materials:
        lines.append(
            f"  - {m.name} (qty: {m.quantity}, ~${m.estimated_cost_usd or 0:,.2f}, {m.category or 'misc'})"
        )
    return "\n".join(lines)


@router.post("", response_model=schemas.ProjectDetail)
def create_project(payload: schemas.ProjectCreate, db: Session = Depends(get_db)):
    try:
        plan = ai.generate_plan(
            name=payload.name,
            description=payload.description,
            budget_usd=payload.budget_usd,
            target_date=payload.target_date,
        )
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except anthropic.APIStatusError as e:
        raise HTTPException(
            status_code=502,
            detail=f"Claude API error ({e.status_code}): {e.message}",
        )
    except anthropic.APIConnectionError as e:
        raise HTTPException(
            status_code=502, detail=f"Could not reach the Claude API: {e}"
        )

    project = models.Project(
        name=payload.name,
        description=payload.description,
        budget_usd=payload.budget_usd,
        target_date=payload.target_date,
        summary=plan.get("summary"),
        estimated_total_cost_usd=plan.get("estimated_total_cost_usd"),
        estimated_duration_days=plan.get("estimated_duration_days"),
        budget_notes=plan.get("budget_notes"),
    )
    db.add(project)
    db.flush()

    cursor = date.today()
    for idx, t in enumerate(plan.get("tasks", [])):
        duration = max(1, int(t.get("duration_days") or 1))
        task_start = cursor
        task_end = cursor + timedelta(days=duration - 1)
        cursor = task_end + timedelta(days=1)
        db.add(
            models.Task(
                project_id=project.id,
                order_index=idx,
                title=t["title"],
                description=t["description"],
                estimated_cost_usd=t.get("estimated_cost_usd"),
                duration_days=duration,
                start_date=task_start,
                end_date=task_end,
            )
        )

    for m in plan.get("shopping_list", []):
        db.add(
            models.MaterialItem(
                project_id=project.id,
                name=m["name"],
                quantity=m["quantity"],
                estimated_cost_usd=m.get("estimated_cost_usd"),
                category=m.get("category"),
            )
        )

    image_query = plan.get("image_search_query") or payload.name
    for img in images.search_images(image_query, count=3):
        db.add(
            models.ExampleImage(
                project_id=project.id,
                url=img["url"],
                thumbnail_url=img.get("thumbnail_url"),
                title=img.get("title"),
                source_url=img.get("source_url"),
                creator=img.get("creator"),
            )
        )

    db.commit()
    db.refresh(project)
    return project


@router.get("", response_model=list[schemas.ProjectListItem])
def list_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).order_by(models.Project.created_at.desc()).all()


@router.get("/{project_id}", response_model=schemas.ProjectDetail)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.get(models.Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.delete("/{project_id}", status_code=204)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.get(models.Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()


@router.post("/{project_id}/ask", response_model=schemas.AskResponse)
def ask_question(
    project_id: int, payload: schemas.AskRequest, db: Session = Depends(get_db)
):
    project = db.get(models.Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    context = _build_project_context(project)
    history = [{"role": m.role, "content": m.content} for m in project.messages]

    try:
        answer = ai.answer_question(context, history, payload.question)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except anthropic.APIStatusError as e:
        raise HTTPException(
            status_code=502,
            detail=f"Claude API error ({e.status_code}): {e.message}",
        )
    except anthropic.APIConnectionError as e:
        raise HTTPException(
            status_code=502, detail=f"Could not reach the Claude API: {e}"
        )

    db.add(models.Message(project_id=project.id, role="user", content=payload.question))
    db.add(models.Message(project_id=project.id, role="assistant", content=answer))
    db.commit()

    return schemas.AskResponse(answer=answer)
