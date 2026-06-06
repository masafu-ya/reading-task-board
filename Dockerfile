# Railway: build from repo root (Root Directory must be empty)
FROM python:3.12-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Invalidate Railway/Docker layer cache (increment when backend DB config changes)
ARG CACHEBUST=2026-06-06-v2
RUN echo "cachebust=${CACHEBUST}" > /dev/null

COPY backend/ .
RUN chmod +x entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]
