import json
import os
from datetime import date
from typing import Optional

import anthropic

MODEL = "claude-sonnet-5"

_client: Optional[anthropic.Anthropic] = None


def get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if not api_key:
            raise RuntimeError(
                "ANTHROPIC_API_KEY is not set. Copy backend/.env.example to "
                "backend/.env and add your key."
            )
        _client = anthropic.Anthropic(api_key=api_key)
    return _client


PLAN_TOOL = {
    "name": "submit_project_plan",
    "description": "Submit a structured home DIY project plan.",
    "input_schema": {
        "type": "object",
        "properties": {
            "summary": {
                "type": "string",
                "description": "A short 2-4 sentence overview of the project and approach.",
            },
            "estimated_total_cost_usd": {
                "type": "number",
                "description": "Best-effort total estimated cost in USD for materials and any rentals.",
            },
            "estimated_duration_days": {
                "type": "integer",
                "description": "Best-effort estimate of how many days the project will take a beginner/intermediate DIYer, accounting for the target finish date.",
            },
            "budget_notes": {
                "type": "string",
                "description": "Notes on how the plan fits the stated budget, and any trade-offs or cheaper alternatives if it doesn't.",
            },
            "tasks": {
                "type": "array",
                "description": "Ordered, step-by-step tasks to complete the project.",
                "items": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string"},
                        "description": {
                            "type": "string",
                            "description": "Concrete, actionable instructions for this step.",
                        },
                        "estimated_cost_usd": {
                            "type": "number",
                            "description": "Cost attributable to this step, if any (0 if none).",
                        },
                    },
                    "required": ["title", "description"],
                },
            },
            "shopping_list": {
                "type": "array",
                "description": "Aggregated list of materials/tools to buy.",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "quantity": {"type": "string"},
                        "estimated_cost_usd": {"type": "number"},
                        "category": {
                            "type": "string",
                            "description": "e.g. lumber, hardware, tools, paint/finish, electrical, plumbing",
                        },
                    },
                    "required": ["name", "quantity"],
                },
            },
        },
        "required": [
            "summary",
            "estimated_total_cost_usd",
            "tasks",
            "shopping_list",
        ],
    },
}


def generate_plan(
    name: str, description: str, budget_usd: float, target_date: Optional[date]
) -> dict:
    target_date_str = target_date.isoformat() if target_date else "not specified"
    user_prompt = (
        f"Project: {name}\n"
        f"Description / idea: {description}\n"
        f"Budget: ${budget_usd:,.2f} USD\n"
        f"Target finish date: {target_date_str}\n"
        f"Today's date: {date.today().isoformat()}\n\n"
        "Create a realistic, beginner-friendly home DIY project plan: an ordered "
        "task list, a shopping list with estimated costs, and an overall cost and "
        "duration estimate. Keep the plan achievable within the stated budget where "
        "possible, and call out clearly in budget_notes if it can't be done for that "
        "budget and what the cheapest realistic alternative would cost."
    )

    client = get_client()
    response = client.messages.create(
        model=MODEL,
        max_tokens=4096,
        system=(
            "You are Home DIY Coach, an assistant that turns a home improvement "
            "idea into a concrete, actionable project plan for a non-professional "
            "homeowner. Always respond by calling the submit_project_plan tool."
        ),
        tools=[PLAN_TOOL],
        tool_choice={"type": "tool", "name": "submit_project_plan"},
        messages=[{"role": "user", "content": user_prompt}],
    )

    for block in response.content:
        if block.type == "tool_use" and block.name == "submit_project_plan":
            return block.input

    raise RuntimeError("Claude did not return a project plan.")


def answer_question(
    project_context: str, history: list[dict], question: str
) -> str:
    client = get_client()

    messages = []
    for m in history:
        messages.append({"role": m["role"], "content": m["content"]})
    messages.append({"role": "user", "content": question})

    response = client.messages.create(
        model=MODEL,
        max_tokens=1024,
        system=(
            "You are Home DIY Coach, an assistant helping a homeowner with a "
            "specific home improvement project. Here is everything known about "
            "their project so far (the plan you generated, and prior conversation "
            "context):\n\n" + project_context + "\n\n"
            "Answer the homeowner's questions about this project clearly and "
            "practically. Keep answers focused and concise unless detail is asked "
            "for."
        ),
        messages=messages,
    )

    text_parts = [b.text for b in response.content if b.type == "text"]
    return "\n".join(text_parts).strip()
