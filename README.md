# Personal Activity Memory

自分の過去を検索できる。詳細は [docs/product-vision.md](docs/product-vision.md) / [docs/mvp.md](docs/mvp.md) / [docs/architecture.md](docs/architecture.md) を参照。

## 構成

npm workspacesによるモノレポ構成。

| ディレクトリ | 役割 |
| --- | --- |
| `apps/web` | Frontend (Next.js) |
| `apps/api` | Backend (NestJS) |
| `spikes/` | 技術検証用の使い捨てスクリプト |
| `docs/` | 企画・設計ドキュメント |

## 開発環境のセットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
```

### 3. PostgreSQLの起動（Docker Compose）

```bash
docker compose up -d
```

### 4. Prisma Clientの生成

```bash
npm run generate --workspace apps/api
```

## 起動方法

```bash
# Backend (NestJS) http://localhost:3000
npm run dev:api

# Frontend (Next.js) http://localhost:3000 (別ポートで起動する場合は各自調整)
npm run dev:web
```

Backend起動後、`GET /health` にアクセスするとPostgreSQLへの接続状態を確認できる。

```bash
curl http://localhost:3000/health
# => {"status":"ok","database":"connected"}
```

## テスト

```bash
# 全workspace分をまとめて実行
npm test

# 個別に実行する場合
npm run test --workspace apps/api
npm run test --workspace apps/web
```
