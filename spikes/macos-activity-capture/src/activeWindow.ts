import activeWin from "active-win";

export interface ActiveWindowInfo {
  appName: string;
  windowTitle: string;
}

export async function getActiveWindowInfo(): Promise<ActiveWindowInfo | null> {
  try {
    const result = await activeWin();
    if (!result) {
      return null;
    }
    return {
      appName: result.owner.name,
      windowTitle: result.title,
    };
  } catch (error) {
    // 権限未許可時などに失敗しうる。検証対象そのものなのでログに残しつつループは継続する。
    console.error(
      "[activeWindow] failed to read active window info:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
