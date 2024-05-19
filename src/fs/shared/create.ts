import { mkdir } from "node:fs/promises";
import type { DirectoryOptions } from "../types.js";

export default async (path: string, options?: DirectoryOptions) => {
  await mkdir(path, {
    ...options,
    recursive: options?.recursive ?? true,
  });
};
