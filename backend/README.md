# backend（Day 3: FastAPI）

学習用の API サーバです。MySQL 連携はまだで、タスクはメモリに保持します。

## 起動

```powershell
cd "D:\cursolアプリ\サンプルプロジェクト１\backend"
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

uvicorn main:app --reload --port 8000
```

## 動作確認

- `GET /health`
  - `http://localhost:8000/health`
- Swagger UI
  - `http://localhost:8000/docs`
- タスク一覧 / 追加
  - `GET /tasks` : `http://localhost:8000/tasks`
  - `POST /tasks`（例）

```json
{
  "title": "テストタスク",
  "memo": "任意",
  "done": false
}
```

## CORS

Next.js（`http://localhost:3000`）から呼び出すため、最低限の CORS を許可しています。

