import { spawn } from "node:child_process";
import { syncVialCatalog } from "./sync-vial-catalog.mjs";

try {
  await syncVialCatalog({
    log(message) {
      console.log(`[catalog-sync] ${message}`);
    },
  });
} catch (error) {
  console.warn("[catalog-sync] Startup sync failed; continuing to start storefront.", {
    message: error instanceof Error ? error.message : "Unknown error",
  });
}

const child = spawn("next", ["start"], {
  env: process.env,
  shell: process.platform === "win32",
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
