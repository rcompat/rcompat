import type { WritableInput } from "@rcompat/fs/#/types";

export default async (path: string, input: WritableInput) => {
  const buffer = input instanceof Blob ? await input.text() : input;
  return Deno.writeTextFile(path, buffer);
};
