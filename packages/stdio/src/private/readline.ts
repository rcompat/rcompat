import { stdin, stdout } from "node:process";
import * as readline from "node:readline";

export default (): Promise<null | string> =>
  new Promise((resolve) => {
    const r = readline.createInterface({
      crlfDelay: Infinity,
      historySize: 0,
      input: stdin,
      output: stdout,
      terminal: Boolean(stdout.isTTY),
    });

    let done = false;
    const finish = (val: null | string) => {
      if (done) return;
      done = true;
      try { r.removeAllListeners(); } catch { }
      try { r.close(); } catch { }
      resolve(val);
    };

    r.once("line", (line) => finish(line));
    r.once("SIGINT", () => finish(null)); // Ctrl+C
    r.once("close", () => finish(null)); // Ctrl+D / EOF
  });
