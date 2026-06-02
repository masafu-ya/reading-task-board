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

Import 直後に **1 回デプロイが走ります**。MySQL や環境変数がまだ無いと **Build は成功しても起動で失敗** することがあります（正常な流れです）。

Railway 公式の monorepo 手順に従い、Backend の **Root Directory を `/backend`** に設定します。設定ファイルは **`backend/railway.toml`** と **`backend/Dockerfile`** です。

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

### 4. Backend サービス（Import 済みの場合）

Import で作られたサービスが Backend です。

#### 4-1. Source（Root Directory）— 最重要

**Settings** → **Source** → **Add Root Directory** をクリックし、次を入力:

```
backend
```

保存すると **Root Directory: `/backend`** と表示されます。

> Railway 公式 monorepo 手順: Backend は `/backend` フォルダだけをビルドします。

#### 4-2. Variables — 古い変数を削除

**Variables** タブで **`RAILWAY_DOCKERFILE_PATH`** がある場合は **削除**してください（⋮ メニュー → Delete）。

この変数があると、存在しないルートの `Dockerfile` を探して **2 秒で Build 失敗** します。

#### 4-3. Build

**Settings** → **Build**:

| 項目 | 設定値 |
|------|--------|
| **Builder** | **Dockerfile**（Automatically Detected） |
| **Dockerfile Path** | `Dockerfile`（`backend` フォルダ内） |

#### 4-4. ドメイン

**Settings** → **Networking** → **Generate Domain**（HTTPS URL を取得）

#### 4-5. Redeploy

**Deployments** → **Deploy** / **Redeploy**

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

### Import 直後のデプロイ失敗（よくある）

| Build Logs の内容 | 原因 | 対処 |
|-------------------|------|------|
| `requirements.txt not found` | Root Directory が空 | Source → Root Directory に **`backend`** を設定 |
| `Dockerfile does not exist` | `RAILWAY_DOCKERFILE_PATH` が残っている | Variables から **削除** |
| Build が数秒で失敗 | ルート Dockerfile を参照している | Root Directory = **`backend`** + 上記変数削除 |
| `Nixpacks` / `npm install` 失敗 | Frontend まで含めて自動判定された | Builder を **Dockerfile** に変更 |
| Build 成功 → Deploy 失敗 / Crash | **MySQL や JWT 未設定** | 下記「5. 環境変数」を設定して **Redeploy** |
| `database: disconnected` | DB 未接続 or init.sql 未実行 | MySQL 追加 + `init.sql` 適用 |

**ログの見方**: サービス → **Deployments** → 失敗した行 → **View Logs**（Build / Deploy タブ）

**再デプロイ**: 設定を直したら **Deploy** → **Redeploy**（または GitHub に push）

### それでも Build が 3 秒で失敗する場合

1. **Variables** から `RAILWAY_DOCKERFILE_PATH` を **削除**
2. **Source** → Root Directory = **`backend`**
3. **Redeploy**
4. Build ログに `pip install` が 30 秒以上出るか確認

### その他

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
