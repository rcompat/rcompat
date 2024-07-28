import type { WritableInput } from "@rcompat/fs/#/types";

export default (path: string, input: WritableInput) => Bun.write(path, input);
