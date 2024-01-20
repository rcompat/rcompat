import { mkdir } from "node:fs/promises";

export default async (path, options) => {
  await mkdir(path, {
    ...options,
    recursive: options?.recursive ?? true,
  });
};
