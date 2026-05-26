from datetime import datetime
from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


app = FastAPI(title="Reading & Task Board API (Learning)")

# Day4 以降で Next.js（localhost:3000）から呼び出す前提なので最小限で許可します。
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
    # 現時点のフロントは done を送らない予定ですが、後日の拡張のため保持します。
    done: bool = False


class TaskOut(TaskCreate):
    id: int
    created_at: datetime


# 学習用のためメモリに保持（サーバ再起動で初期化されます）
_tasks: list[TaskOut] = [
    TaskOut(id=1, title="FastAPI の /health を確認する", memo="Swagger で試せます", done=False, created_at=datetime.utcnow()),
]
_next_id = 2


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/tasks", response_model=list[TaskOut])
def list_tasks():
    return _tasks


@app.post("/tasks", response_model=TaskOut)
def create_task(task: TaskCreate):
    global _next_id
    new_task = TaskOut(
        id=_next_id,
        title=task.title,
        memo=task.memo,
        done=task.done,
        created_at=datetime.utcnow(),
    )
    _tasks.append(new_task)
    _next_id += 1
    return new_task

