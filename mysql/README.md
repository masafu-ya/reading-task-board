# MySQL 学習用セットアップ

## インストール情報

| 項目 | 値 |
|------|-----|
| バージョン | MySQL 8.4.9 |
| ポート | 3306 |
| 設定ファイル | `C:\ProgramData\MySQL\MySQL Server 8.4\my.ini` |
| データフォルダ | `C:\ProgramData\MySQL\MySQL Server 8.4\Data` |
| 学習用 DB 名 | `learning_app` |

## 接続情報（ローカル・学習用）

`.env` に書く値の例（**Git に commit しない**）:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=LearningApp2026!
DB_NAME=learning_app
```

パスワードは自分用に変更してください。

## 起動方法

Windows サービスが未登録の場合は、プロジェクトルートで:

```powershell
.\mysql\start-mysql.ps1
```

## 接続確認

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root -p
# パスワード入力後
SHOW DATABASES;
USE learning_app;
```

## Windows サービスとして登録（任意・管理者 PowerShell）

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe" --install MySQL84 --defaults-file="C:\ProgramData\MySQL\MySQL Server 8.4\my.ini"
net start MySQL84
```

自動起動にしたい場合に実行してください。
