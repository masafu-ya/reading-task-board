# 10日間 実践学習カリキュラム

**対象**: Cursor・Python・JavaScript・Next.js・MySQL・GitHub 初心者  
**進め方**: 小さな Web アプリを作りながら、毎日 2〜4 時間を目安に学習  
**成果物**: 非公開の「個人メモ＆タスク管理アプリ」（Reading & Task Board）  
**公開**: しない（GitHub は **Private リポジトリ** のみ）

---

## 作るアプリのイメージ

| 機能 | 技術 |
|------|------|
| メモ・タスクの一覧・追加・編集・削除 | Next.js（画面）+ Python API |
| データ保存 | MySQL |
| 画面の動き・入力 | JavaScript / TypeScript |
| 開発環境 | Cursor |
| 履歴管理 | GitHub（private） |

**最終構成（シンプル版）**

```
[ブラウザ] → Next.js (localhost:3000)
                ↓ fetch
            Python FastAPI (localhost:8000)
                ↓
            MySQL (localhost:3306)
```

---

## 事前準備（Day 0・カリキュラム開始前）

- [ ] [Cursor](https://cursor.com) をインストールし、日本語 UI が使えるなら設定
- [ ] [Node.js LTS](https://nodejs.org/) をインストール（`node -v` / `npm -v` で確認）
- [ ] [Python 3.11+](https://www.python.org/) をインストール（`python --version`）
- [ ] [MySQL](https://dev.mysql.com/downloads/installer/) または [Docker Desktop](https://www.docker.com/products/docker-desktop/) + MySQL コンテナ
- [ ] [Git](https://git-scm.com/) をインストール（`git --version`）
- [ ] [GitHub](https://github.com) アカウント作成
- [ ] このフォルダを Cursor で開く: `サンプルプロジェクト１`

**Cursor 初心者向けの基本操作（最初に覚える）**

| 操作 | ショートカット（Win） |
|------|----------------------|
| AI に質問・依頼 | `Ctrl + L`（Chat） |
| コードを選択して修正依頼 | 選択 → `Ctrl + K`（Inline Edit） |
| ファイルを開く | `Ctrl + P` |
| ターミナル | `` Ctrl + ` `` |

**AI への聞き方のコツ**

- 「〇〇を実装して」だけでなく、「初心者向けにコメント付きで」「理由も説明して」と書く
- エラーは **全文コピー** して貼る
- 1 日の範囲は「このファイルだけ直して」のように小さく区切る

---

## GitHub の使い方（10 日間を通して）

| タイミング | やること |
|------------|----------|
| Day 1 | Private リポジトリ作成、`README` だけ push |
| Day 2〜9 | 機能が動くたびに `git add` → `commit` → `push` |
| Day 10 | タグ `v0.1.0` や Release（任意・非公開のまま） |

**毎日の Git ルーティン（5 分）**

```bash
git status
git add .
git commit -m "Day3: タスク一覧 API を追加"
git push
```

**コミットメッセージの例**

- `Day1: プロジェクト初期構成`
- `Day5: MySQL に tasks テーブル作成`
- `fix: 作成日時が UTC になる問題を修正`

---

# Day 1 — 環境・GitHub・Cursor と「画面の箱」

**ゴール**: リポジトリ作成、Next.js でトップページだけ表示

### 学ぶこと

- ターミナル、フォルダ構成、npm の基本
- Git の `init` / `add` / `commit` / `push`
- Next.js のページ = `app/page.tsx` の考え方
- Cursor でプロジェクト生成を頼む方法

### 実践タスク

1. GitHub で **Private** リポジトリ `reading-task-board`（名前は任意）を作成
2. Cursor ターミナルで:

   ```bash
   cd "d:\cursolアプリ\サンプルプロジェクト１"
   git init
   npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
   ```

3. `frontend` を起動: `cd frontend && npm run dev` → `http://localhost:3000`
4. `app/page.tsx` を編集し、「Reading & Task Board」「学習用アプリ」と表示
5. ルートに `README.md` を書き、GitHub に push

### Cursor 練習

- Chat: 「Next.js App Router でシンプルなヘッダー付きレイアウトを作って」
- 生成されたコードの **1 行ずつ**「この import は何？」と質問

### チェックリスト

- [ ] localhost:3000 でページが見える
- [ ] GitHub にコードが上がっている（Private）
- [ ] 今日の変更を 1 回以上 commit した

---

# Day 2 — JavaScript / TypeScript の土台 + コンポーネント

**ゴール**: 静的なタスク一覧 UI（まだ DB なし）

### 学ぶこと

- `const` / `let`、配列 `map`、オブジェクト
- TypeScript の型（`interface Task { id: number; title: string }`）
- React のコンポーネント、props、state（`useState`）
- クライアントコンポーネント `"use client"`

### 実践タスク

1. ダミーデータでタスク一覧コンポーネントを作成
2. 入力フォーム +「追加」ボタン（追加は **画面だけ**、まだ API なし）
3. Tailwind で最低限の見た目（カード、ボタン）

### おすすめファイル構成

```
frontend/src/
  components/TaskList.tsx
  components/TaskForm.tsx
  app/page.tsx
```

### Cursor 練習

- タスク配列を選択 → Inline Edit: 「削除ボタンを追加して」
- 「useState の使い方を初心者向けにコメントで追記して」

### チェックリスト

- [ ] 配列を `map` で表示できる
- [ ] フォームから state にタスクを追加できる
- [ ] commit: `Day2: タスク一覧 UI（ダミーデータ）`

---

# Day 3 — Python 入門 + FastAPI で最初の API

**ゴール**: Python バックエンドが動き、JSON を返す

### 学ぶこと

- Python の venv、pip、`requirements.txt`
- FastAPI、ルーティング、`GET` / `POST`
- JSON、HTTP ステータスコード
- CORS（フロントから API を呼ぶために必要）

### 実践タスク

1. プロジェクトルートに `backend` フォルダを作成

   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate
   pip install fastapi uvicorn python-multipart
   pip freeze > requirements.txt
   ```

2. `main.py` で以下を実装:
   - `GET /health` → `{ "status": "ok" }`
   - `GET /tasks` → メモリ上のリスト（ダミー）
   - `POST /tasks` → 1 件追加（まだ DB なし）

3. 起動: `uvicorn main:app --reload --port 8000`
4. ブラウザで `http://localhost:8000/docs`（Swagger UI）を触る

### Cursor 練習

- 「FastAPI で CORS を許可する最小コードを追加して」
- エラー Traceback をそのまま貼って修正依頼

### チェックリスト

- [ ] `/docs` で API を試せる
- [ ] POST でタスクが増える（メモリ上）
- [ ] `.gitignore` に `venv/` を追加して commit

---

# Day 4 — フロントと API の接続（fetch / async）

**ゴール**: Next.js から Python API を呼び、一覧表示・追加

### 学ぶこと

- `fetch`、`async/await`、try/catch
- 環境変数 `NEXT_PUBLIC_API_URL`
- フロントとバックの **別ポート** 開発

### 実践タスク

1. `frontend/.env.local` に `NEXT_PUBLIC_API_URL=http://localhost:8000`
2. ダミーデータをやめ、`useEffect` で `GET /tasks`
3. フォーム送信で `POST /tasks` → 成功後に一覧再取得
4. ローディング・エラー表示を簡易実装

### Cursor 練習

- 「fetch のエラーハンドリングを初心者向けコメント付きで」
- Network タブの見方を AI に聞く（DevTools）

### チェックリスト

- [ ] フロントと API が両方起動した状態で動作
- [ ] リロードするとメモリ API なのでデータは消える（正常）→ Day 5 で MySQL
- [ ] commit: `Day4: FastAPI と Next.js 連携`

---

# Day 5 — MySQL 基礎 + 永続化

**ゴール**: タスクを DB に保存し、再起動しても残る

### 学ぶこと

- SQL: `CREATE TABLE`, `INSERT`, `SELECT`, `UPDATE`, `DELETE`
- 主キー、AUTO_INCREMENT、`DATETIME`
- Python から DB 接続（`mysql-connector-python` または `SQLAlchemy` 初心者は前者でも可）

### 実践タスク

1. MySQL で DB とテーブル作成:

   ```sql
   CREATE DATABASE learning_app;
   USE learning_app;

   CREATE TABLE tasks (
     id INT AUTO_INCREMENT PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     memo TEXT,
     done TINYINT(1) DEFAULT 0,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. `backend/.env`（**Git に含めない**）に DB 接続情報
3. FastAPI の各エンドポイントを DB 操作に差し替え
4. ルートの `.gitignore` に `.env` を追加

### セキュリティ（学習用でも習慣化）

- パスワードは `.env` のみ
- `.env.example` にはキー名だけ書く

### チェックリスト

- [ ] MySQL Workbench または CLI で `SELECT * FROM tasks` ができる
- [ ] API 再起動後もデータが残る
- [ ] commit: `Day5: MySQL 永続化`（`.env` は commit しない）

---

# Day 6 — CRUD 完成 + SQL の読み書き

**ゴール**: 編集・削除・完了フラグまで一通り

### 学ぶこと

- REST の考え方: `GET/POST/PUT/PATCH/DELETE`
- SQL の `WHERE`、`UPDATE`
- UI: 編集モード、確認ダイアログ

### 実践タスク

**API（Python）**

- `PUT /tasks/{id}` … タイトル・メモ更新
- `PATCH /tasks/{id}/done` … 完了トグル
- `DELETE /tasks/{id}` … 削除

**フロント（Next.js）**

- 各行に「編集」「削除」「完了」ボタン
- 完了は取り消し線などで視覚化

### Cursor 練習

- 「この SQL はインジェクション対策できている？」とコードレビューを依頼
- パラメータ化クエリを使うよう修正

### チェックリスト

- [ ] CRUD がすべてブラウザから操作できる
- [ ] commit: `Day6: タスク CRUD 完成`

---

# Day 7 — 「読書メモ」機能 + データ設計

**ゴール**: `books` テーブルとメモを追加し、アプリのテーマに寄せる

### 学ぶこと

- テーブル設計（1 対多: 本 → 複数メモ）
- `JOIN` の基本
- 複数リソースの API 設計

### 実践タスク

1. テーブル追加:

   ```sql
   CREATE TABLE books (
     id INT AUTO_INCREMENT PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     author VARCHAR(255),
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE book_notes (
     id INT AUTO_INCREMENT PRIMARY KEY,
     book_id INT NOT NULL,
     content TEXT NOT NULL,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
   );
   ```

2. API: `/books`, `/books/{id}/notes`
3. フロント: 本の一覧 → クリックでメモ一覧（別ページ `app/books/[id]/page.tsx`）

### チェックリスト

- [ ] 本を登録し、メモを複数付けられる
- [ ] 本を削除するとメモも消える（CASCADE）
- [ ] ER 図を README に手書き or Mermaid で追記

---

# Day 8 — Next.js の構造整理 + ルーティング・コンポーネント分割

**ゴール**: コードを読みやすくし、JavaScript の理解を深める

### 学ぶこと

- App Router: `layout.tsx`, `loading.tsx`, 動的ルート
- コンポーネント分割、カスタムフック（例: `useTasks`）
- 共通 UI（Header, Button）

### 実践タスク

1. `src/hooks/useTasks.ts` に API 呼び出しを集約
2. `src/lib/api.ts` に `fetch` の共通処理
3. ナビゲーション: ホーム（タスク）/ 本一覧 / について
4. 型定義を `src/types/index.ts` にまとめる

### Cursor 練習

- Agent に「リファクタリングだけ。動作は変えないで」と依頼
- diff を確認してから Accept する習慣

### チェックリスト

- [ ] ファイル役割が README の構成図と一致
- [ ] commit: `Day8: コンポーネントと hooks 整理`

---

# Day 9 — GitHub 実践（ブランチ・PR・Issue）+ 品質

**ゴール**: チーム開発の作法を一人で体験

### 学ぶこと

- ブランチ: `git checkout -b feature/search`
- Pull Request（自分で main にマージ）
- Issue で「やること」を管理
- 簡易バリデーション、エラーメッセージの日本語化

### 実践タスク

1. GitHub Issue を 3 つ作成（例: 検索、タグ、ダークモード）
2. 1 機能だけブランチで実装 → PR 作成 → 自分でレビュー → Merge
3. タスクに **検索**（SQL `LIKE` またはフロント filter）を追加
4. `README.md` にセットアップ手順を書く（他人が読んでも動かせるレベル）

### README に書く項目テンプレート

- 必要環境
- 起動手順（MySQL / backend / frontend の順）
- 環境変数一覧（`.env.example` 参照）

### チェックリスト

- [ ] ブランチ → PR → merge を 1 回以上実施
- [ ] Issue を close した
- [ ] README が揃っている

---

# Day 10 — 仕上げ・振り返り・次の一歩

**ゴール**: 動画デモレベルの完成、学習の言語化

### 学ぶこと

- 簡単な Docker Compose（任意・時間があれば）
- デプロイの概念（今回はローカルのみで OK）
- 学んだことの整理

### 実践タスク

1. **仕上げ（2〜3 時間）**
   - 空状態の UI（データ 0 件時のメッセージ）
   - 簡単なスタイル統一
   - `git tag v0.1.0`（任意）

2. **振り返りドキュメント** `REFLECTION.md` を作成
   - わかったこと 5 つ
   - まだ難しいこと 3 つ
   - 次に学びたいこと（認証、テスト、Docker など）

3. **動作確認チェックリスト** をすべて実行

### 最終動作確認

- [ ] MySQL 起動 → Backend 起動 → Frontend 起動
- [ ] タスク CRUD
- [ ] 本とメモの CRUD
- [ ] GitHub に全履歴がある（Private）
- [ ] `.env` がリポジトリに含まれていない

---

## 10 日間の技術マップ（何をどの日で触るか）

| 技術 | 主に学ぶ日 |
|------|------------|
| Cursor | 毎日（特に Day 1, 8, 9） |
| GitHub | Day 1, 9, 10 + 毎日 commit |
| JavaScript / TS | Day 2, 4, 8 |
| Next.js | Day 1, 2, 4, 7, 8 |
| Python | Day 3, 5, 6, 7 |
| MySQL | Day 5, 6, 7 |
| HTTP / API 設計 | Day 3, 4, 6, 9 |

---

## つまずきやすいポイントと対処

| 症状 | 確認すること |
|------|----------------|
| CORS エラー | FastAPI の CORS 設定、`NEXT_PUBLIC_API_URL` |
| DB 接続失敗 | MySQL 起動、`.env` のホスト/ユーザー/パスワード |
| `fetch failed` | backend が 8000 で動いているか |
| ポート使用中 | 他の `node` / `uvicorn` プロセスを終了 |
| Git push 拒否 | `git remote -v`、GitHub の認証（PAT または SSH） |

**Cursor への質問例**

> 「このエラーを初心者向けに原因と修正手順を3ステップで教えて: [エラー全文]」

---

## 学習後のおすすめステップ（11 日目以降）

1. **認証**: NextAuth または JWT でログイン（まだ非公開のまま）
2. **テスト**: Python `pytest`、フロント `Vitest`
3. **Docker Compose**: MySQL + API を一発起動
4. **デプロイ体験**: Vercel（フロントのみ）+ Railway 等（学習用無料枠）

---

## このリポジトリの推奨フォルダ構成（Day 10 時点）

```
サンプルプロジェクト１/
├── LEARNING_CURRICULUM.md   ← このファイル
├── REFLECTION.md            ← Day 10 で作成
├── README.md
├── .gitignore
├── frontend/                ← Next.js
└── backend/                 ← Python FastAPI
```

---

## 毎日の開始ルーティン（2 分）

1. Cursor でプロジェクトを開く
2. MySQL → `uvicorn` → `npm run dev` の順で起動
3. 昨日の `git pull`（別 PC なしならスキップ）
4. 今日の Day セクションのチェックリストだけ読む

頑張ってください。分からない箇所は **Day 番号 + エラー全文** を添えて Cursor に聞くと、カリキュラムに沿った回答が得やすくなります。
