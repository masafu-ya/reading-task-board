def test_task_crud(client, auth_headers, require_db):
    create = client.post(
        "/tasks",
        headers=auth_headers,
        json={"title": "pytest task", "memo": "test memo"},
    )
    assert create.status_code == 200
    task = create.json()
    task_id = task["id"]
    assert task["title"] == "pytest task"

    listing = client.get("/tasks", headers=auth_headers)
    assert listing.status_code == 200
    ids = [t["id"] for t in listing.json()]
    assert task_id in ids

    updated = client.put(
        f"/tasks/{task_id}",
        headers=auth_headers,
        json={"title": "updated task", "memo": "updated"},
    )
    assert updated.status_code == 200
    assert updated.json()["title"] == "updated task"

    toggled = client.patch(f"/tasks/{task_id}/done", headers=auth_headers)
    assert toggled.status_code == 200
    assert toggled.json()["done"] is True

    deleted = client.delete(f"/tasks/{task_id}", headers=auth_headers)
    assert deleted.status_code == 204


def test_task_search(client, auth_headers, require_db):
    client.post(
        "/tasks",
        headers=auth_headers,
        json={"title": "unique-search-keyword-xyz", "memo": None},
    )
    found = client.get("/tasks?q=unique-search-keyword", headers=auth_headers)
    assert found.status_code == 200
    assert any("unique-search-keyword" in t["title"] for t in found.json())


def test_users_cannot_see_each_others_tasks(
    client,
    unique_email,
    require_db,
):
    password = "password1234"
    email_a = unique_email
    email_b = f"b_{unique_email}"

    token_a = client.post(
        "/auth/register",
        json={"email": email_a, "password": password},
    ).json()["access_token"]
    token_b = client.post(
        "/auth/register",
        json={"email": email_b, "password": password},
    ).json()["access_token"]
    headers_a = {"Authorization": f"Bearer {token_a}"}
    headers_b = {"Authorization": f"Bearer {token_b}"}

    created = client.post(
        "/tasks",
        headers=headers_a,
        json={"title": "user A private task", "memo": None},
    )
    assert created.status_code == 200
    task_id = created.json()["id"]

    list_b = client.get("/tasks", headers=headers_b)
    assert list_b.status_code == 200
    assert all(t["id"] != task_id for t in list_b.json())

    get_b = client.put(
        f"/tasks/{task_id}",
        headers=headers_b,
        json={"title": "hack", "memo": None},
    )
    assert get_b.status_code == 404
