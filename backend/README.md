# backend（FastAPI + MySQL）

学習用の API サーバです。Day 5 以降、タスクは MySQL に保存されます。

## 事前準備

1. MySQL を起動

```powershell
cd "D:\cursolアプリ\サンプルプロジェクト１"
.\mysql\start-mysql.ps1
```

2. テーブル作成（初回のみ）

```powershell
Get-Content "..\mysql\init.sql" | & "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root -p
```

3. `backend/.env` を作成（`.env.example` をコピーしてパスワードを設定）

## 起動

```powershell
cd "D:\cursolアプリ\サンプルプロジェクト１\backend"
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

uvicorn main:app --reload --port 8000
```

## 動作確認

- `GET /health` → `{"status":"ok","database":"connected"}`
- Swagger UI → `http://localhost:8000/docs`
- MySQL で確認:

```sql
USE learning_app;
SELECT * FROM tasks;
```

## CORS

Next.js（`http://localhost:3000`）から呼び出すため、最低限の CORS を許可しています。
