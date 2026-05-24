# GitHub アカウント準備ガイド（Day 0）

学習用アプリは **公開しません**。Private リポジトリのみ使います。

---

## チェックリスト

- [ ] 1. GitHub アカウントを作成
- [ ] 2. メール認証を完了
- [ ] 3. 2要素認証（2FA）を有効化（推奨）
- [ ] 4. Git に名前・メールを設定
- [ ] 5. GitHub にログイン（CLI またはブラウザ）
- [ ] 6. Private リポジトリを作成（Day 1 で使う）

---

## 1. アカウント作成（ブラウザ）

1. ブラウザで **https://github.com/signup** を開く
2. メールアドレス、パスワード、ユーザー名を入力
3. メールに届いた **認証コード** を入力
4. アンケートは **Skip** してよい

### ユーザー名の例

- `masaf-learning` のように、本名でなくても OK
- 後から変更可能（ただし URL は変わる）

---

## 2. セキュリティ（推奨）

**Settings** → **Password and authentication** → **Two-factor authentication**

- **Authenticator app**（Google Authenticator 等）がおすすめ
- 学習中にアカウントを守るため、最初に設定しておくと安心

---

## 3. Git に名前を設定（初回のみ）

Cursor のターミナルで、**ご自身の情報** に置き換えて実行:

```powershell
git config --global user.name "あなたの名前"
git config --global user.email "GitHubに登録したメール"
```

確認:

```powershell
git config --global --list
```

`user.name` と `user.email` が表示されれば OK。

---

## 4. GitHub へのログイン（2つの方法）

### 方法 A: GitHub CLI（おすすめ・Cursor から操作しやすい）

ターミナルを **新しく開いて** から:

```powershell
gh auth login
```

対話形式で次を選ぶ:

| 質問 | 選ぶもの |
|------|----------|
| What account? | GitHub.com |
| Preferred protocol | HTTPS（初心者向け） |
| Authenticate | Login with a web browser |
| Git credentials? | Yes |

ブラウザが開いたら **Authorize** をクリック。

確認:

```powershell
gh auth status
```

`Logged in to github.com` と出れば OK。

### 方法 B: ブラウザだけ（CLI を使わない場合）

Day 1 で `git push` するとき、GitHub の **ユーザー名** と **Personal Access Token（PAT）** を聞かれます。  
そのときに PAT を作成します（手順は下記「PAT の作り方」）。

---

## 5. Private リポジトリの作り方

### CLI で作る場合（`gh` ログイン後）

```powershell
cd "d:\cursolアプリ\サンプルプロジェクト１"
gh repo create reading-task-board --private --source=. --remote=origin
```

※ まだ `git init` していない場合は **Day 1** で一緒にやります。

### ブラウザで作る場合

1. https://github.com/new を開く
2. Repository name: `reading-task-board`（任意）
3. **Private** を選択
4. 「Add a README file」は **オフ**（ローカルから push するため）
5. **Create repository** をクリック

---

## PAT の作り方（HTTPS で push するとき）

1. GitHub → 右上アイコン → **Settings**
2. 左下 **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. **Generate new token (classic)**
4. Note: `cursor-learning`
5. Expiration: 90 days など
6. 権限: **repo** にチェック
7. **Generate token** → 表示された文字列を **コピー**（二度と表示されない）

`git push` でパスワードを聞かれたら:

- Username: GitHub のユーザー名
- Password: **PAT を貼り付け**（通常のパスワードではない）

---

## 6. SSH を使う場合（任意・上級者向け）

HTTPS の代わりに SSH キーを使う方法です。

```powershell
ssh-keygen -t ed25519 -C "your-email@example.com"
# Enter 連打でデフォルト保存

Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub
```

表示された文字列をコピーし、GitHub → **Settings** → **SSH and GPG keys** → **New SSH key** に貼り付け。

---

## Day 1 でやること（予告）

1. `git init`
2. Private リポジトリと接続（`git remote add origin ...`）
3. 初回 commit & push

---

## よくあるつまずき

| 症状 | 対処 |
|------|------|
| `git push` が拒否される | PAT を使う / `gh auth login` をやり直す |
| `Support for password authentication was removed` | GitHub パスワードではなく **PAT** が必要 |
| `git config` がない | セクション 3 を実行 |
| `gh` が見つからない | ターミナルを再起動、または `winget install GitHub.cli` |

---

## 準備完了の確認

すべてできたら、次が実行できる状態です:

```powershell
gh auth status
git config --global user.name
git config --global user.email
```

問題なければ **Day 1** に進んでください。
