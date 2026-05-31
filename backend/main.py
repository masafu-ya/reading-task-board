from datetime import datetime
from typing import Annotated, Optional

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

import auth
import books_db as books
import database as db
import users_db as users

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


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class UserOut(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


CurrentUserId = Annotated[int, Depends(auth.get_current_user_id)]


def _handle_db_error(exc: Exception) -> HTTPException:
    if isinstance(exc, LookupError):
        return HTTPException(status_code=404, detail=str(exc))
    return HTTPException(status_code=500, detail=f"DB error: {exc}")


def _token_response(user: dict) -> TokenOut:
    token = auth.create_access_token(user["id"], user["email"])
    return TokenOut(access_token=token)


@app.get("/health")
def health():
    db_ok = db.check_db_connection()
    return {"status": "ok", "database": "connected" if db_ok else "disconnected"}


@app.post("/auth/register", response_model=TokenOut)
def register(body: UserRegister):
    if users.get_user_by_email(body.email):
        raise HTTPException(status_code=409, detail="このメールアドレスは既に登録されています")
    try:
        password_hash = auth.hash_password(body.password)
        user = users.create_user(body.email, password_hash)
        return _token_response(user)
    except Exception as exc:
        raise _handle_db_error(exc) from exc


@app.post("/auth/login", response_model=TokenOut)
def login(body: UserLogin):
    user = auth.authenticate_user(body.email, body.password)
    return _token_response(user)


@app.get("/auth/me", response_model=UserOut)
def me(user_id: CurrentUserId):
    try:
        return users.get_user_by_id(user_id)
    except Exception as exc:
        raise _handle_db_error(exc) from exc


@app.get("/tasks", response_model=list[TaskOut])
def list_tasks(user_id: CurrentUserId, q: Optional[str] = None):
    try:
        search = q.strip() if q else None
        if search == "":
            search = None
        return db.list_tasks(user_id, search)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"DB error: {exc}") from exc


@app.post("/tasks", response_model=TaskOut)
def create_task(task: TaskCreate, user_id: CurrentUserId):
    try:
        return db.create_task(user_id, task.title, task.memo, task.done)
    except Exception as exc:
        raise _handle_db_error(exc) from exc


@app.put("/tasks/{task_id}", response_model=TaskOut)
def update_task(task_id: int, task: TaskUpdate, user_id: CurrentUserId):
    try:
        return db.update_task(task_id, user_id, task.title, task.memo)
    except Exception as exc:
        raise _handle_db_error(exc) from exc


@app.patch("/tasks/{task_id}/done", response_model=TaskOut)
def toggle_task_done(task_id: int, user_id: CurrentUserId):
    try:
        return db.toggle_task_done(task_id, user_id)
    except Exception as exc:
        raise _handle_db_error(exc) from exc


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int, user_id: CurrentUserId):
    try:
        db.delete_task(task_id, user_id)
    except Exception as exc:
        raise _handle_db_error(exc) from exc


@app.get("/books", response_model=list[BookOut])
def list_books(user_id: CurrentUserId):
    try:
        return books.list_books(user_id)
    except Exception as exc:
        raise _handle_db_error(exc) from exc


@app.post("/books", response_model=BookOut)
def create_book(book: BookCreate, user_id: CurrentUserId):
    try:
        return books.create_book(user_id, book.title, book.author)
    except Exception as exc:
        raise _handle_db_error(exc) from exc


@app.get("/books/{book_id}", response_model=BookOut)
def get_book(book_id: int, user_id: CurrentUserId):
    try:
        return books.get_book_by_id(book_id, user_id)
    except Exception as exc:
        raise _handle_db_error(exc) from exc


@app.delete("/books/{book_id}", status_code=204)
def delete_book(book_id: int, user_id: CurrentUserId):
    try:
        books.delete_book(book_id, user_id)
    except Exception as exc:
        raise _handle_db_error(exc) from exc


@app.get("/books/{book_id}/notes", response_model=list[BookNoteOut])
def list_book_notes(book_id: int, user_id: CurrentUserId):
    try:
        return books.list_book_notes(book_id, user_id)
    except Exception as exc:
        raise _handle_db_error(exc) from exc


@app.post("/books/{book_id}/notes", response_model=BookNoteOut)
def create_book_note(book_id: int, note: BookNoteCreate, user_id: CurrentUserId):
    try:
        return books.create_book_note(book_id, user_id, note.content)
    except Exception as exc:
        raise _handle_db_error(exc) from exc
