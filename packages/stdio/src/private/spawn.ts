import { type SpawnOptions, spawn } from "node:child_process";
import { Readable, Writable } from "node:stream";

export default (command: string, options: SpawnOptions) => {
  const { stdin, stdout, stderr } = spawn(command, {
    ...options,
    shell: true,
    stdio: ["pipe", "pipe", "pipe"],
  });

  return {
    stdin: Writable.toWeb(stdin),
    stdout: Readable.toWeb(stdout),
    stderr: Readable.toWeb(stderr),
  };
};
