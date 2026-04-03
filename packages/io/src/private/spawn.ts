import assert from "@rcompat/assert";
import { spawn, type SpawnOptions } from "node:child_process";
import { Readable, Writable } from "node:stream";

type Options = SpawnOptions & { inherit?: boolean };

export default (command: string, options?: Options) => {
  assert.maybe.dict(options);
  const inherit = assert.maybe.boolean(options?.inherit) ?? false;

  if (inherit) {
    return new Promise<void>((resolve, reject) => {
      const child = spawn(command, { ...options, shell: true, stdio: "inherit" });
      child.on("exit", code => code === 0 ? resolve() : reject(code));
    });
  }

  const { stderr, stdin, stdout } = spawn(command, {
    ...options,
    shell: true,
    stdio: ["pipe", "pipe", "pipe"],
  });

  return {
    stderr: Readable.toWeb(stderr),
    stdin: Writable.toWeb(stdin),
    stdout: Readable.toWeb(stdout),
  };
};
