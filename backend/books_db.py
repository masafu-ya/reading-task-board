import os
from contextlib import contextmanager
from typing import Any, Iterator, Optional

import mysql.connector
from mysql.connector import MySQLConnection
from mysql.connector.cursor import MySQLCursorDict


def _env(key: str, default: str) -> str:
    value = os.getenv(key)
    return value if value not in (None, "") else default


def _db_config() -> dict[str, Any]:
    return {
        "host": _env("DB_HOST", "localhost"),
        "port": int(_env("DB_PORT", "3306")),
        "user": _env("DB_USER", "root"),
        "password": _env("DB_PASSWORD", ""),
        "database": _env("DB_NAME", "learning_app"),
        "connection_timeout": 5,
        "ssl_disabled": True,
        "allow_public_key_retrieval": True,
    }


@contextmanager
def get_connection() -> Iterator[MySQLConnection]:
    conn = mysql.connector.connect(**_db_config())
    try:
        yield conn
    finally:
        conn.close()


@contextmanager
def get_cursor() -> Iterator[MySQLCursorDict]:
    with get_connection() as conn:
        cursor = conn.cursor(dictionary=True)
        try:
            yield cursor
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            cursor.close()


def row_to_book(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": row["id"],
        "title": row["title"],
        "author": row["author"],
        "created_at": row["created_at"],
    }


def row_to_note(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": row["id"],
        "book_id": row["book_id"],
        "content": row["content"],
        "created_at": row["created_at"],
    }


def list_books(user_id: int) -> list[dict[str, Any]]:
    with get_cursor() as cursor:
        cursor.execute(
            """
            SELECT id, title, author, created_at
            FROM books
            WHERE user_id = %s
            ORDER BY id ASC
            """,
            (user_id,),
        )
        rows = cursor.fetchall()
    return [row_to_book(row) for row in rows]


def get_book_by_id(book_id: int, user_id: int) -> dict[str, Any]:
    with get_cursor() as cursor:
        cursor.execute(
            """
            SELECT id, title, author, created_at
            FROM books
            WHERE id = %s AND user_id = %s
            """,
            (book_id, user_id),
        )
        row = cursor.fetchone()
    if row is None:
        raise LookupError(f"Book {book_id} not found")
    return row_to_book(row)


def create_book(user_id: int, title: str, author: Optional[str]) -> dict[str, Any]:
    with get_cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO books (title, author, user_id)
            VALUES (%s, %s, %s)
            """,
            (title, author, user_id),
        )
        book_id = cursor.lastrowid
    return get_book_by_id(book_id, user_id)


def delete_book(book_id: int, user_id: int) -> None:
    with get_cursor() as cursor:
        cursor.execute(
            "DELETE FROM books WHERE id = %s AND user_id = %s",
            (book_id, user_id),
        )
        if cursor.rowcount == 0:
            raise LookupError(f"Book {book_id} not found")


def list_book_notes(book_id: int, user_id: int) -> list[dict[str, Any]]:
    get_book_by_id(book_id, user_id)
    with get_cursor() as cursor:
        cursor.execute(
            """
            SELECT id, book_id, content, created_at
            FROM book_notes
            WHERE book_id = %s
            ORDER BY id ASC
            """,
            (book_id,),
        )
        rows = cursor.fetchall()
    return [row_to_note(row) for row in rows]


def create_book_note(book_id: int, user_id: int, content: str) -> dict[str, Any]:
    get_book_by_id(book_id, user_id)
    with get_cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO book_notes (book_id, content)
            VALUES (%s, %s)
            """,
            (book_id, content),
        )
        note_id = cursor.lastrowid
        cursor.execute(
            """
            SELECT id, book_id, content, created_at
            FROM book_notes
            WHERE id = %s
            """,
            (note_id,),
        )
        row = cursor.fetchone()
    if row is None:
        raise RuntimeError("作成したメモの取得に失敗しました")
    return row_to_note(row)
