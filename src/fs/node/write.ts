import { writeFile } from "node:fs/promises";
import type { WritableInput } from "../types.js";

export default async (path: string, input: WritableInput) => {
  const buffer = input instanceof Blob ? await input.text() : input;
  return writeFile(path, buffer);
};
