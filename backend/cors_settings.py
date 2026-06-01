import os

DEFAULT_CORS_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]


def get_cors_origins() -> list[str]:
    """CORS 許可オリジン（ローカル + CORS_ORIGINS 環境変数）"""
    origins = set(DEFAULT_CORS_ORIGINS)
    raw = os.getenv("CORS_ORIGINS", "")
    for origin in raw.split(","):
        cleaned = origin.strip()
        if cleaned:
            origins.add(cleaned.rstrip("/"))
    return sorted(origins)
