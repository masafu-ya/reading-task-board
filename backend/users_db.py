from typing import Any, Optional

from database import get_cursor


def row_to_user(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": row["id"],
        "email": row["email"],
        "created_at": row["created_at"],
    }


def get_user_by_email(email: str) -> Optional[dict[str, Any]]:
    with get_cursor() as cursor:
        cursor.execute(
            """
            SELECT id, email, password_hash, created_at
            FROM users
            WHERE email = %s
            """,
            (email.lower(),),
        )
        row = cursor.fetchone()
    if row is None:
        return None
    return {
        **row_to_user(row),
        "password_hash": row["password_hash"],
    }


def get_user_by_id(user_id: int) -> dict[str, Any]:
    with get_cursor() as cursor:
        cursor.execute(
            """
            SELECT id, email, created_at
            FROM users
            WHERE id = %s
            """,
            (user_id,),
        )
        row = cursor.fetchone()
    if row is None:
        raise LookupError(f"User {user_id} not found")
    return row_to_user(row)


def create_user(email: str, password_hash: str) -> dict[str, Any]:
    normalized = email.lower().strip()
    with get_cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO users (email, password_hash)
            VALUES (%s, %s)
            """,
            (normalized, password_hash),
        )
        user_id = cursor.lastrowid
    return get_user_by_id(user_id)
