from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ProjectCreate(BaseModel):
    name: str
    description: str
    budget_usd: float = Field(gt=0)
    target_date: date


class TaskOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_index: int
    title: str
    description: str
    estimated_cost_usd: Optional[float] = None
    duration_days: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class MaterialOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    quantity: str
    estimated_cost_usd: Optional[float] = None
    category: Optional[str] = None


class MessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    role: str
    content: str
    created_at: datetime


class ProjectListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    budget_usd: float
    target_date: Optional[date] = None
    estimated_total_cost_usd: Optional[float] = None
    created_at: datetime


class ProjectDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str
    budget_usd: float
    target_date: Optional[date] = None
    created_at: datetime
    summary: Optional[str] = None
    estimated_total_cost_usd: Optional[float] = None
    estimated_duration_days: Optional[int] = None
    budget_notes: Optional[str] = None
    tasks: list[TaskOut] = []
    materials: list[MaterialOut] = []
    messages: list[MessageOut] = []


class AskRequest(BaseModel):
    question: str


class AskResponse(BaseModel):
    answer: str
