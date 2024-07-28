import type { WritableInput } from "@rcompat/fs/#/types";
import { writeFile } from "node:fs/promises";

export default async (path: string, input: WritableInput) => {
  const buffer = input instanceof Blob ? await input.text() : input;
  return writeFile(path, buffer);
};
