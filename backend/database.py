import os
from contextlib import contextmanager
from datetime import datetime
from typing import Any, Iterator, Optional

import mysql.connector
from mysql.connector import MySQLConnection
from mysql.connector.cursor import MySQLCursorDict


def _env(key: str, default: str) -> str:
    """Railway の参照変数が未解決だと空文字になるため、default にフォールバックする。"""
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
        # Railway 内部 MySQL（mysql.railway.internal）向け
        "ssl_disabled": True,
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


def row_to_task(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": row["id"],
        "title": row["title"],
        "memo": row["memo"],
        "done": bool(row["done"]),
        "created_at": row["created_at"],
    }


def list_tasks(user_id: int, query: Optional[str] = None) -> list[dict[str, Any]]:
    with get_cursor() as cursor:
        if query:
            pattern = f"%{query}%"
            cursor.execute(
                """
                SELECT id, title, memo, done, created_at
                FROM tasks
                WHERE user_id = %s AND (title LIKE %s OR memo LIKE %s)
                ORDER BY id ASC
                """,
                (user_id, pattern, pattern),
            )
        else:
            cursor.execute(
                """
                SELECT id, title, memo, done, created_at
                FROM tasks
                WHERE user_id = %s
                ORDER BY id ASC
                """,
                (user_id,),
            )
        rows = cursor.fetchall()
    return [row_to_task(row) for row in rows]


def create_task(
    user_id: int,
    title: str,
    memo: Optional[str],
    done: bool,
) -> dict[str, Any]:
    with get_cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO tasks (title, memo, done, user_id)
            VALUES (%s, %s, %s, %s)
            """,
            (title, memo, int(done), user_id),
        )
        task_id = cursor.lastrowid
    return get_task_by_id(task_id, user_id)


def get_task_by_id(task_id: int, user_id: int) -> dict[str, Any]:
    with get_cursor() as cursor:
        cursor.execute(
            """
            SELECT id, title, memo, done, created_at
            FROM tasks
            WHERE id = %s AND user_id = %s
            """,
            (task_id, user_id),
        )
        row = cursor.fetchone()
    if row is None:
        raise LookupError(f"Task {task_id} not found")
    return row_to_task(row)


def update_task(
    task_id: int,
    user_id: int,
    title: str,
    memo: Optional[str],
) -> dict[str, Any]:
    with get_cursor() as cursor:
        cursor.execute(
            """
            UPDATE tasks
            SET title = %s, memo = %s
            WHERE id = %s AND user_id = %s
            """,
            (title, memo, task_id, user_id),
        )
        if cursor.rowcount == 0:
            raise LookupError(f"Task {task_id} not found")
    return get_task_by_id(task_id, user_id)


def toggle_task_done(task_id: int, user_id: int) -> dict[str, Any]:
    with get_cursor() as cursor:
        cursor.execute(
            "SELECT done FROM tasks WHERE id = %s AND user_id = %s",
            (task_id, user_id),
        )
        row = cursor.fetchone()
        if row is None:
            raise LookupError(f"Task {task_id} not found")
        new_done = 0 if row["done"] else 1
        cursor.execute(
            "UPDATE tasks SET done = %s WHERE id = %s AND user_id = %s",
            (new_done, task_id, user_id),
        )
    return get_task_by_id(task_id, user_id)


def delete_task(task_id: int, user_id: int) -> None:
    with get_cursor() as cursor:
        cursor.execute(
            "DELETE FROM tasks WHERE id = %s AND user_id = %s",
            (task_id, user_id),
        )
        if cursor.rowcount == 0:
            raise LookupError(f"Task {task_id} not found")


def check_db_connection() -> bool:
    try:
        with get_connection() as conn:
            conn.is_connected()
        return True
    except (mysql.connector.Error, ValueError):
        return False
