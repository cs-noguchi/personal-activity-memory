import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { getActiveWindowInfo } from "./activeWindow.js";
import { getChromeTabInfo } from "./chromeTab.js";
import { appendActivityLog } from "./storage.js";
import type { ActivitySnapshot } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOG_FILE = join(__dirname, "..", "data", "activity-log.jsonl");
const POLL_INTERVAL_MS = Number(process.env.POLL_INTERVAL_MS ?? 5000);

async function captureOnce(): Promise<ActivitySnapshot | null> {
  const active = await getActiveWindowInfo();
  if (!active) {
    return null;
  }

  const isChrome = active.appName === "Google Chrome";
  const chromeTab = isChrome ? await getChromeTabInfo() : null;

  return {
    timestamp: new Date().toISOString(),
    appName: active.appName,
    windowTitle: active.windowTitle,
    chromeTab,
  };
}

let snapshotCount = 0;

async function tick(): Promise<void> {
  const snapshot = await captureOnce();
  if (!snapshot) {
    console.warn("[capture] no active window info returned");
    return;
  }
  appendActivityLog(LOG_FILE, snapshot);
  snapshotCount += 1;
  console.log(
    `[capture #${snapshotCount}] ${snapshot.timestamp} ${snapshot.appName} - ${snapshot.windowTitle}` +
      (snapshot.chromeTab ? ` (${snapshot.chromeTab.url})` : ""),
  );
}

console.log(`Writing snapshots to ${LOG_FILE}`);
console.log(`Polling every ${POLL_INTERVAL_MS}ms. Press Ctrl+C to stop.`);

function runTick(): void {
  tick().catch((error) => console.error("[capture] unexpected error:", error));
}

const timer = setInterval(runTick, POLL_INTERVAL_MS);

process.on("SIGINT", () => {
  clearInterval(timer);
  console.log(`\nStopped. Captured ${snapshotCount} snapshot(s) -> ${LOG_FILE}`);
  process.exit(0);
});

runTick();
