import type { DirectoryOptions } from "@rcompat/fs/#/types";
import { mkdir } from "node:fs/promises";

export default async (path: string, options?: DirectoryOptions) => {
  await mkdir(path, {
    ...options,
    recursive: options?.recursive ?? true,
  });
};
