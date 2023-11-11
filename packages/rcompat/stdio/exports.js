export { stdin, stdout, stderr } from "node:process";
import { exec } from "node:process";

const execute = (command, options) => new Promise((resolve, reject) => {
  exec(command, options, (error, stdout, stderr) =>
    error === null ? resolve(stdout) : reject(stderr));
});

export { execute };
