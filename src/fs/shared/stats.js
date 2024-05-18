import { lstat } from "node:fs/promises";

export default path => lstat(path);
