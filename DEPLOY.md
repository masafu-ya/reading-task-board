# デプロイ手順 — Reading & Task Board

**Private 学習用** — 本番 URL は SNS 等に公開しないこと。

---

## 構成（Day 14 時点）

```
[ブラウザ] → Frontend（Day 15: Vercel / ローカル localhost:3000）
                ↓ HTTPS + JWT
            Backend（Railway / Render 等）
                ↓
            MySQL（クラウド DB）
```

Day 14 では **Backend + MySQL** をクラウドに載せます。Frontend は Day 15 で Vercel に載せます。

---

## 必要な環境変数（Backend）

| 変数 | 例 | 説明 |
|------|-----|------|
| `DB_HOST` | `xxx.railway.app` | クラウド MySQL のホスト |
| `DB_PORT` | `3306` | MySQL ポート |
| `DB_USER` | `root` | DB ユーザー |
| `DB_PASSWORD` | （秘密） | DB パスワード |
| `DB_NAME` | `learning_app` | データベース名 |
| `JWT_SECRET` | （長いランダム文字列） | JWT 署名用 |
| `JWT_EXPIRE_MINUTES` | `1440` | トークン有効期限（分） |
| `CORS_ORIGINS` | `https://your-app.vercel.app` | 本番フロント URL（カンマ区切り可） |
| `PORT` | （PaaS が自動設定） | Railway / Render が注入 |

ローカル開発用の `http://localhost:3000` はコード側で常に許可されます。

---

## 方法 A: Railway（推奨・学習向け）

### 1. 準備

1. [Railway](https://railway.app) アカウント作成
2. GitHub 連携
3. このリポジトリ（`reading-task-board`）を Railway から Import

### 2. MySQL サービスを追加

1. プロジェクト → **+ New** → **Database** → **MySQL**
2. MySQL サービスの **Variables** タブで接続情報を確認  
   （`MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE` など）

### 3. DB スキーマを適用

Railway MySQL に `mysql/init.sql` を流し込みます。

**例（Railway CLI または MySQL クライアント）:**

```bash
mysql -h YOUR_MYSQL_HOST -P YOUR_PORT -u root -p YOUR_DATABASE < mysql/init.sql
```

PowerShell から Railway の公開 TCP プロキシを使う場合は、Railway ダッシュボードの Connect タブの手順に従ってください。

### 4. Backend サービスを追加

1. **+ New** → **GitHub Repo** → 同じリポジトリ
2. **Settings** → **Root Directory** は空（リポジトリルート）
3. **Settings** → **Build**:
   - Builder: **Dockerfile**
   - Dockerfile Path: `backend/Dockerfile`
   - Docker Context: `backend`
4. **Settings** → **Networking** → **Generate Domain**（HTTPS URL を取得）

### 5. Backend の環境変数

Backend サービスの **Variables** に設定:

| 変数 | 値の例 |
|------|--------|
| `DB_HOST` | MySQL の `${{MySQL.MYSQLHOST}}` または Variables からコピー |
| `DB_PORT` | `${{MySQL.MYSQLPORT}}` |
| `DB_USER` | `${{MySQL.MYSQLUSER}}` |
| `DB_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |
| `DB_NAME` | `${{MySQL.MYSQLDATABASE}}` |
| `JWT_SECRET` | 32 文字以上のランダム文字列（新規生成） |
| `JWT_EXPIRE_MINUTES` | `1440` |
| `CORS_ORIGINS` | Day 15 まで空でも可。ローカル検証時は未設定で OK |

Railway では MySQL サービスを参照変数でつなげられます（`${{MySQL.MYSQLHOST}}` 形式）。

### 6. デプロイ確認

```powershell
curl https://YOUR-BACKEND.up.railway.app/health
```

期待:

```json
{"status":"ok","database":"connected"}
```

### 7. ローカル Frontend から本番 API を試す（Day 14 確認用）

`frontend/.env.local` を一時的に変更:

```
NEXT_PUBLIC_API_URL=https://YOUR-BACKEND.up.railway.app
```

```powershell
cd frontend
npm run dev
```

http://localhost:3000 で登録・ログイン・タスク CRUD を確認。  
確認後、URL を `http://localhost:8000` に戻しても構いません。

---

## 方法 B: Render（参考）

### Backend（Web Service）

1. [Render](https://render.com) → **New** → **Web Service**
2. GitHub リポジトリを接続
3. **Root Directory**: `backend`
4. **Environment**: Docker
5. 環境変数は上表と同じ
6. **Create Web Service** → 付与された `https://xxx.onrender.com` をメモ

### MySQL

Render の無料 MySQL は制限があるため、学習用は **Railway MySQL** または **PlanetScale** 等を Backend の `DB_*` に設定する方法が現実的です。

---

## トラブルシューティング

| 症状 | 確認 |
|------|------|
| `/health` で `database: disconnected` | `DB_*` が正しいか、MySQL が起動しているか、`init.sql` 適用済みか |
| 502 / アプリが起動しない | Deploy Logs で `uvicorn` エラーを確認。`JWT_SECRET` 未設定など |
| CORS エラー | `CORS_ORIGINS` にフロント URL（`https://`・末尾 `/` なし） |
| 401 だけ成功 | 正常（未ログイン）。`/auth/register` で登録を試す |

---

## Day 15 への引き継ぎ

- Backend の HTTPS URL をメモしておく
- Vercel デプロイ後、`CORS_ORIGINS` に Vercel URL を追加して Backend を再デプロイ

---

## セキュリティチェックリスト

- [ ] `JWT_SECRET` / `DB_PASSWORD` を GitHub に commit していない
- [ ] 本番 DB パスワードは開発用と別の強力なもの
- [ ] デプロイ URL は Private 運用（学習用）
