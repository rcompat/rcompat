import { readFile } from "node:fs/promises";

export default (path: string) => readFile(path, { encoding: undefined });
