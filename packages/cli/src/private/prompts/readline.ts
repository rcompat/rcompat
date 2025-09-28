import stdin from "@rcompat/stdio/stdin";
import stdout from "@rcompat/stdio/stdout";

let active: null | Promise<null | string> = null;

export default function readLine(): Promise<null | string> {
  if (active) return active;

  try { stdout.write("\x1B[?25h"); } catch { }

  active = new Promise<null | string>((resolve) => {
    let buffer = "";

    const finish = (val: null | string) => {
      // cleanup listeners
      try { stdin.off("data", onData); } catch { }
      try { stdin.off("end", onEnd); } catch { }
      try { stdin.off("error", onErr); } catch { }
      const p = active;
      active = null; // allow next read
      resolve(val);
      return p;
    };

    const onEnd = () => finish(null);
    const onErr = () => finish(null);

    const onData = (chunk: unknown) => {
      const s = typeof chunk === "string" ? chunk : Buffer.from(chunk as any).toString("utf8");

      if (s.includes("\x03") /* ^C */ || s.includes("\x04") /* ^D */) {
        return void finish(null);
      }

      const nl = s.search(/\r?\n/);
      if (nl >= 0) {
        buffer += s.slice(0, nl);
        return void finish(buffer);
      }

      buffer += s;
    };

    stdin.on("data", onData);
    stdin.once("end", onEnd);
    stdin.once("error", onErr);
  });

  return active;
}
