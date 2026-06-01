def test_tasks_requires_auth(client):
    res = client.get("/tasks")
    assert res.status_code == 401


def test_register_login_and_me(client, unique_email, require_db):
    password = "password1234"

    register = client.post(
        "/auth/register",
        json={"email": unique_email, "password": password},
    )
    assert register.status_code == 200
    token = register.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    me = client.get("/auth/me", headers=headers)
    assert me.status_code == 200
    assert me.json()["email"] == unique_email

    login = client.post(
        "/auth/login",
        json={"email": unique_email, "password": password},
    )
    assert login.status_code == 200
    assert login.json()["access_token"]


def test_register_duplicate_email(client, unique_email, require_db):
    password = "password1234"
    payload = {"email": unique_email, "password": password}
    assert client.post("/auth/register", json=payload).status_code == 200
    dup = client.post("/auth/register", json=payload)
    assert dup.status_code == 409
