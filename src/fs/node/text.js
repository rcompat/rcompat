import { readFile } from "node:fs/promises";

export default (path, options) => readFile(path, {
  encoding: options?.encoding ?? "utf8",
  ...options,
});
