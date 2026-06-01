import os

from cors_settings import get_cors_origins


def test_default_localhost_origins():
    os.environ.pop("CORS_ORIGINS", None)
    origins = get_cors_origins()
    assert "http://localhost:3000" in origins
    assert "http://127.0.0.1:3000" in origins


def test_cors_origins_from_env(monkeypatch):
    monkeypatch.setenv(
        "CORS_ORIGINS",
        "https://app.example.com, https://other.example.com/",
    )
    origins = get_cors_origins()
    assert "https://app.example.com" in origins
    assert "https://other.example.com" in origins
    assert "http://localhost:3000" in origins
