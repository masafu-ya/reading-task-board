from datetime import datetime
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import database as db

load_dotenv()

app = FastAPI(title="Reading & Task Board API (Learning)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    memo: Optional[str] = None
    done: bool = False


class TaskOut(TaskCreate):
    id: int
    created_at: datetime


@app.get("/health")
def health():
    db_ok = db.check_db_connection()
    return {"status": "ok", "database": "connected" if db_ok else "disconnected"}


@app.get("/tasks", response_model=list[TaskOut])
def list_tasks():
    try:
        return db.list_tasks()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"DB error: {exc}") from exc


@app.post("/tasks", response_model=TaskOut)
def create_task(task: TaskCreate):
    try:
        return db.create_task(task.title, task.memo, task.done)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"DB error: {exc}") from exc
