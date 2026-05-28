from datetime import datetime
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import database as db
import books_db as books

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


class TaskUpdate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    memo: Optional[str] = None


class TaskOut(TaskCreate):
    id: int
    created_at: datetime


class BookCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    author: Optional[str] = Field(default=None, max_length=255)


class BookOut(BookCreate):
    id: int
    created_at: datetime


class BookNoteCreate(BaseModel):
    content: str = Field(min_length=1)


class BookNoteOut(BookNoteCreate):
    id: int
    book_id: int
    created_at: datetime


def _handle_db_error(exc: Exception) -> HTTPException:
    if isinstance(exc, LookupError):
        return HTTPException(status_code=404, detail=str(exc))
    return HTTPException(status_code=500, detail=f"DB error: {exc}")


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
        raise _handle_db_error(exc) from exc


@app.put("/tasks/{task_id}", response_model=TaskOut)
def update_task(task_id: int, task: TaskUpdate):
    try:
        return db.update_task(task_id, task.title, task.memo)
    except Exception as exc:
        raise _handle_db_error(exc) from exc


@app.patch("/tasks/{task_id}/done", response_model=TaskOut)
def toggle_task_done(task_id: int):
    try:
        return db.toggle_task_done(task_id)
    except Exception as exc:
        raise _handle_db_error(exc) from exc


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int):
    try:
        db.delete_task(task_id)
    except Exception as exc:
        raise _handle_db_error(exc) from exc


@app.get("/books", response_model=list[BookOut])
def list_books():
    try:
        return books.list_books()
    except Exception as exc:
        raise _handle_db_error(exc) from exc


@app.post("/books", response_model=BookOut)
def create_book(book: BookCreate):
    try:
        return books.create_book(book.title, book.author)
    except Exception as exc:
        raise _handle_db_error(exc) from exc


@app.get("/books/{book_id}", response_model=BookOut)
def get_book(book_id: int):
    try:
        return books.get_book_by_id(book_id)
    except Exception as exc:
        raise _handle_db_error(exc) from exc


@app.delete("/books/{book_id}", status_code=204)
def delete_book(book_id: int):
    try:
        books.delete_book(book_id)
    except Exception as exc:
        raise _handle_db_error(exc) from exc


@app.get("/books/{book_id}/notes", response_model=list[BookNoteOut])
def list_book_notes(book_id: int):
    try:
        return books.list_book_notes(book_id)
    except Exception as exc:
        raise _handle_db_error(exc) from exc


@app.post("/books/{book_id}/notes", response_model=BookNoteOut)
def create_book_note(book_id: int, note: BookNoteCreate):
    try:
        return books.create_book_note(book_id, note.content)
    except Exception as exc:
        raise _handle_db_error(exc) from exc
