import std from "@rcompat/io/std";

let active: null | Promise<null | string> = null;

export default function readLine(): Promise<null | string> {
  if (active) return active;

  try { std.out.write("\x1B[?25h"); } catch { }

  active = new Promise<null | string>((resolve) => {
    let buffer = "";

    const finish = (val: null | string) => {
      // cleanup listeners
      try { std.in.off("data", onData); } catch { }
      try { std.in.off("end", onEnd); } catch { }
      try { std.in.off("error", onErr); } catch { }
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

    std.in.on("data", onData);
    std.in.once("end", onEnd);
    std.in.once("error", onErr);
  });

  return active;
}
