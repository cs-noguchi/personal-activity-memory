// 「今どのアプリのどのウィンドウを見ているか」を取得するファイル。
// 実際にOSから情報を取ってくる処理は、外部ライブラリ "active-win" に任せている。
import activeWin from "active-win";

// このファイル内で使う戻り値の型（アプリ名とウィンドウタイトルだけを持つシンプルな形）
export interface ActiveWindowInfo {
  appName: string;
  windowTitle: string;
}

// アクティブウィンドウの情報を取得する関数。
// 呼び出し側は「await getActiveWindowInfo()」のように結果を待って使う。
export async function getActiveWindowInfo(): Promise<ActiveWindowInfo | null> {
  try {
    // active-win に問い合わせて、今アクティブなウィンドウの情報をもらう
    const result = await activeWin();

    // 情報が取れなかった場合（対象ウィンドウが無いなど）は null を返す
    if (!result) {
      return null;
    }

    // active-win が返す情報の中から、必要な項目だけを取り出して返す
    return {
      appName: result.owner.name, // アプリ名（例: "Google Chrome"）
      windowTitle: result.title, // ウィンドウのタイトル文字列
    };
  } catch (error) {
    // ここに来るのは主に「macOSの権限が許可されていない」ケース。
    // 権限未許可時などに失敗しうる。検証対象そのものなのでログに残しつつループは継続する。
    // → エラーで処理全体を止めず、ログだけ出して null を返し、呼び出し元には
    //   「今回は取得できなかった」として扱わせる。
    console.error(
      "[activeWindow] failed to read active window info:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
