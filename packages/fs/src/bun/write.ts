import type { WritableInput } from "../types.js";

export default (path: string, input: WritableInput) => Bun.write(path, input);
