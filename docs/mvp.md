# MVP

最初から位置情報・メール・スマートフォンなどすべてを収集しない。

MVPでは、「PC上で昨日何をしていたかをAIに聞ける」ところまでを実装する。

## 収集対象

- アクティブアプリ
- ウィンドウタイトル
- WebブラウザのURL・ページタイトル
- GitHub Commit
- GitHub Issue / Pull Request
- 手動メモ
- 時刻

## Timeline

収集したEventを時系列で表示する。

例：

```
10:02 VS Code
10:14 Chrome
10:18 Spring Security公式ドキュメント
10:41 VS Code
11:03 Git commit
11:12 GitHub Pull Request
```

AIによって、

10:02〜11:12 「Spring Security認証機能の修正」

とまとめる。

## AI検索

以下のような質問を可能にする。

- 今日何をしていた？
- 昨日の15時ごろ何してた？
- 今週GitHubで何を変更した？
- 認証について最後に作業したのはいつ？
- 今週何を勉強した？

## 将来的な機能

MVP完成後、段階的に入力ソースを追加する。

### Phase 2

- Google Calendar
- Gmail
- GitHub連携強化
- AIによる日次・週次要約

### Phase 3

- iPhone / Android
- 位置情報
- 写真
- 移動履歴

### Phase 4

デジタル活動と現実世界の活動を統合する。

例：

```
08:20 自宅を出発
08:45 電車移動
09:13 カフェ到着
09:20〜10:34 Personal Memory開発
10:37 GitHubへcommit
11:05 移動
```

最終的に、**Life Timeline** へ発展させる。
