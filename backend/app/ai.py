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
                        "duration_days": {
                            "type": "integer",
                            "description": "How many calendar days this step takes, assuming steps happen one after another. Minimum 1.",
                        },
                    },
                    "required": ["title", "description", "duration_days"],
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


def generate_plan(name: str, description: str, budget_usd: float, target_date: date) -> dict:
    days_available = (target_date - date.today()).days
    user_prompt = (
        f"Project: {name}\n"
        f"Description / idea: {description}\n"
        f"Budget: ${budget_usd:,.2f} USD\n"
        f"Today's date: {date.today().isoformat()}\n"
        f"Target finish date: {target_date.isoformat()} ({days_available} days from today)\n\n"
        "Create a realistic, beginner-friendly home DIY project plan: an ordered "
        "task list (each with a duration_days), a shopping list with estimated costs, "
        "and an overall cost and duration estimate. Each task's duration_days should "
        "assume tasks happen one after another (sequentially), and the tasks' "
        "duration_days should sum to estimated_duration_days. Keep the plan achievable "
        "within the stated budget and by the target finish date where possible. If the "
        "plan can't realistically fit in the time available, still schedule it as "
        "efficiently as possible and clearly say so in budget_notes, including what a "
        "realistic finish date would be. If it can't be done for the stated budget, "
        "call that out in budget_notes too along with the cheapest realistic "
        "alternative."
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
