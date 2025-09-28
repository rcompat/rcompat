import * as readline from "node:readline";

export default (): Promise<null | string> =>
  new Promise((resolve) => {
    const r = readline
      .createInterface({ input: process.stdin, output: process.stdout });

    let done = false;
    const finish = (value: null | string) => {
      if (done) return;
      done = true;
      // remove listeners then close; closing releases the event loop hold.
      r.removeAllListeners();
      r.close();
      resolve(value);
    };

    r.once("line", (line) => finish(line));
    // Ctrl+C -> null (caller treats as cancel)
    r.once("SIGINT", () => finish(null));
    // Ctrl+D / EOF
    r.once("close", () => finish(null));
  });
