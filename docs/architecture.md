# Architecture

## 技術構成

### Frontend

- TypeScript
- React
- Next.js

### Backend

- TypeScript
- NestJS

### Database

- PostgreSQL

将来的には必要に応じて、

- Vector Search
- Redis
- Queue
- 時系列データ向け仕組み

を追加する。

### Infrastructure

- AWS
- Docker
- IaC
- CloudWatch

### CI/CD

- GitHub
- GitHub Actions

### AI

LLMを利用して、

- Event分類
- Activity要約
- 意味検索
- Personal Memoryへの質問回答

を行う。

## AIエージェントを利用した開発

本プロジェクト自体を、**AI Agent中心のSoftware Engineeringを実践する場** とする。

### メインCoding Agent：Claude Code

主な役割：

- 実装
- テスト
- リファクタリング
- コード調査
- Issue対応

### 人間側は、

- 企画
- 要件定義
- アーキテクチャ判断
- タスク分割
- コードレビュー
- 受入テスト
- 技術選定

を担当する。

必要に応じてCodexなど別モデルによるレビューも行う。

「AIにプロダクトを作らせる」のではなく、**AIを開発チームの一員として管理する能力** を身につける。

## Privacy / Security

本サービスにおける最重要課題の一つ。

収集対象には、

- PC利用履歴
- Web閲覧履歴
- GitHub履歴
- 位置情報
- カレンダー
- メール

など非常にセンシティブな情報が含まれる可能性がある。

そのため、**Privacy by Design** を基本思想とする。

### 検討項目

- Local First
- データ暗号化
- 通信暗号化
- OAuth
- ユーザー自身によるデータ削除
- 収集対象の細かなON/OFF
- 保存期間設定
- サービス運営者からもデータを閲覧できない構成

将来的には、「あなたの記憶はあなたのもの」をプロダクト原則の一つとする。
