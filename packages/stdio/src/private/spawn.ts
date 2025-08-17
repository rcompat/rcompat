import { type SpawnOptions, spawn } from "node:child_process";
import { Readable, Writable } from "node:stream";

export default (command: string, options: SpawnOptions) => {
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
