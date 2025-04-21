import { type ExecOptions, exec } from "node:child_process";

export default (command: string, options?: ExecOptions): Promise<string> =>
  new Promise((resolve, reject) => {
    exec(command, options ?? {}, (error, stdout, stderr) =>
      error === null ? resolve(stdout) : reject(stderr));
});
