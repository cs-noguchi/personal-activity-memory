// このファイルは「データの形」だけを定義するファイル。
// 処理は書かれておらず、「こういう項目を持つデータですよ」という設計図(型)のみ。

// Chromeの1タブ分の情報
export interface ChromeTabInfo {
  url: string; // 開いているページのURL（例: https://example.com）
  title: string; // 開いているページのタイトル
}

// 1回分の「行動スナップショット」＝ある瞬間に何をしていたかの記録
export interface ActivitySnapshot {
  timestamp: string; // 記録した日時（ISO形式の文字列）
  appName: string; // その瞬間にアクティブだったアプリ名（例: "Google Chrome"）
  windowTitle: string; // そのアプリのウィンドウタイトル
  chromeTab: ChromeTabInfo | null; // アクティブアプリがChromeのときだけタブ情報が入る。それ以外はnull
}
