import io from "@rcompat/io";

let active: null | Promise<null | string> = null;

export default function readLine(): Promise<null | string> {
  if (active) return active;

  try { io.stdout.write("\x1B[?25h"); } catch { }

  active = new Promise<null | string>((resolve) => {
    let buffer = "";

    const finish = (val: null | string) => {
      // cleanup listeners
      try { io.stdin.off("data", onData); } catch { }
      try { io.stdin.off("end", onEnd); } catch { }
      try { io.stdin.off("error", onErr); } catch { }
      const p = active;
      active = null; // allow next read
      resolve(val);
      return p;
    };

    const onEnd = () => finish(null);
    const onErr = () => finish(null);

    const onData = (chunk: unknown) => {
      const s = typeof chunk === "string"
        ? chunk
        : Buffer.from(chunk as any).toString("utf8");

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

    io.stdin.on("data", onData);
    io.stdin.once("end", onEnd);
    io.stdin.once("error", onErr);
  });

  return active;
}
