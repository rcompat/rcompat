import type { WritableInput } from "#types";

export default (path: string, input: WritableInput) => Bun.write(path, input);
