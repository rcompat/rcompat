import * as readline from "node:readline";

let rl: null | readline.Interface = null;

function ensure() {
  if (rl) return rl;
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return rl;
}

export default (): Promise<null | string> =>
  new Promise((resolve) => {
    const r = ensure();
    r.once("line", (line) => resolve(line));
    r.once("close", () => resolve(null));
  });
