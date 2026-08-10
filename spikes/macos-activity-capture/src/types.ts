export interface ChromeTabInfo {
  url: string;
  title: string;
}

export interface ActivitySnapshot {
  timestamp: string;
  appName: string;
  windowTitle: string;
  chromeTab: ChromeTabInfo | null;
}
