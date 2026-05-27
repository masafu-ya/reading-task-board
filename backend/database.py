import os
from contextlib import contextmanager
from datetime import datetime
from typing import Any, Iterator, Optional

import mysql.connector
from mysql.connector import MySQLConnection
from mysql.connector.cursor import MySQLCursorDict


def _db_config() -> dict[str, Any]:
    return {
        "host": os.getenv("DB_HOST", "localhost"),
        "port": int(os.getenv("DB_PORT", "3306")),
        "user": os.getenv("DB_USER", "root"),
        "password": os.getenv("DB_PASSWORD", ""),
        "database": os.getenv("DB_NAME", "learning_app"),
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


def list_tasks() -> list[dict[str, Any]]:
    with get_cursor() as cursor:
        cursor.execute(
            "SELECT id, title, memo, done, created_at FROM tasks ORDER BY id ASC"
        )
        rows = cursor.fetchall()
    return [row_to_task(row) for row in rows]


def create_task(title: str, memo: Optional[str], done: bool) -> dict[str, Any]:
    with get_cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO tasks (title, memo, done)
            VALUES (%s, %s, %s)
            """,
            (title, memo, int(done)),
        )
        task_id = cursor.lastrowid
        cursor.execute(
            """
            SELECT id, title, memo, done, created_at
            FROM tasks
            WHERE id = %s
            """,
            (task_id,),
        )
        row = cursor.fetchone()
    if row is None:
        raise RuntimeError("作成したタスクの取得に失敗しました")
    return row_to_task(row)


def check_db_connection() -> bool:
    try:
        with get_connection() as conn:
            conn.is_connected()
        return True
    except mysql.connector.Error:
        return False
