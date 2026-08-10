import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { ChromeTabInfo } from "./types.js";

const execFileAsync = promisify(execFile);

const DELIMITER = "|||";

const SCRIPT = `
tell application "Google Chrome"
  set theURL to URL of active tab of front window
  set theTitle to title of active tab of front window
end tell
return theURL & "${DELIMITER}" & theTitle
`;

// osascriptの出力（"url|||title"形式）を構造化データへ変換する純粋関数。
// 実行結果の文字列パースだけを切り出すことで、AppleScript実行を伴わずテストできる。
export function parseChromeTabOutput(raw: string): ChromeTabInfo | null {
  const trimmed = raw.trim();
  if (!trimmed.includes(DELIMITER)) {
    return null;
  }
  const [url, ...titleParts] = trimmed.split(DELIMITER);
  return {
    url: url.trim(),
    title: titleParts.join(DELIMITER).trim(),
  };
}

export async function getChromeTabInfo(): Promise<ChromeTabInfo | null> {
  try {
    const { stdout } = await execFileAsync("osascript", ["-e", SCRIPT]);
    return parseChromeTabOutput(stdout);
  } catch (error) {
    // Chromeが起動していない、ウィンドウが無い、権限が無い等で失敗しうる。
    // 検証対象そのものなので握りつぶさずログに残す。
    console.error(
      "[chromeTab] failed to read tab info:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
