from datetime import datetime, date

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Text,
    Date,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship

from app.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    budget_usd = Column(Float, nullable=False)
    target_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    summary = Column(Text, nullable=True)
    estimated_total_cost_usd = Column(Float, nullable=True)
    estimated_duration_days = Column(Integer, nullable=True)
    budget_notes = Column(Text, nullable=True)

    tasks = relationship(
        "Task", back_populates="project", cascade="all, delete-orphan",
        order_by="Task.order_index",
    )
    materials = relationship(
        "MaterialItem", back_populates="project", cascade="all, delete-orphan"
    )
    messages = relationship(
        "Message", back_populates="project", cascade="all, delete-orphan",
        order_by="Message.created_at",
    )
    example_images = relationship(
        "ExampleImage", back_populates="project", cascade="all, delete-orphan"
    )


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    order_index = Column(Integer, nullable=False, default=0)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    estimated_cost_usd = Column(Float, nullable=True)
    duration_days = Column(Integer, nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)

    project = relationship("Project", back_populates="tasks")


class MaterialItem(Base):
    __tablename__ = "material_items"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    name = Column(String, nullable=False)
    quantity = Column(String, nullable=False)
    estimated_cost_usd = Column(Float, nullable=True)
    category = Column(String, nullable=True)

    project = relationship("Project", back_populates="materials")


class ExampleImage(Base):
    __tablename__ = "example_images"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    url = Column(String, nullable=False)
    thumbnail_url = Column(String, nullable=True)
    title = Column(String, nullable=True)
    source_url = Column(String, nullable=True)
    creator = Column(String, nullable=True)

    project = relationship("Project", back_populates="example_images")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    role = Column(String, nullable=False)  # "user" or "assistant"
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="messages")
