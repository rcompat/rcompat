import { lstat } from "node:fs/promises";

export default (path: string) => lstat(path);
