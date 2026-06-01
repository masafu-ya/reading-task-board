"""pytest 共通設定（FastAPI TestClient・認証ヘルパー）"""

from __future__ import annotations

import uuid

import pytest
from fastapi.testclient import TestClient

import database as db
from main import app


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


@pytest.fixture(scope="session")
def db_available() -> bool:
    return db.check_db_connection()


@pytest.fixture
def require_db(db_available: bool) -> None:
    if not db_available:
        pytest.skip("MySQL が起動していません（Day 12: start-mysql.ps1 を実行）")


@pytest.fixture
def unique_email() -> str:
    return f"pytest_{uuid.uuid4().hex[:12]}@example.com"


@pytest.fixture
def auth_headers(client: TestClient, unique_email: str, require_db: None) -> dict[str, str]:
    password = "password1234"
    res = client.post(
        "/auth/register",
        json={"email": unique_email, "password": password},
    )
    assert res.status_code == 200, res.text
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
