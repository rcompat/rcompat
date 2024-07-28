import type { RemoveOptions } from "@rcompat/fs/#/types";
import { exists } from "@rcompat/fs/native/#";
import maybe from "@rcompat/invariant/maybe";
import { rm } from "node:fs/promises";

export default async (path: string, options?: RemoveOptions) => {
  maybe(options).object();

  // if not set to fail and exists, do nothing
  if (!options?.fail && !await exists(path)) {
    return;
  }

  await rm(path, {
    ...options,
    recursive: options?.recursive ?? true,
  });
};
