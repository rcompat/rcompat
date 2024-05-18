import { rm } from "node:fs/promises";
import { maybe } from "rcompat/invariant";
import exists from "./exists.js";

export default async (path, options = {}) => {
  maybe(options).object();

  // if not set to fail and exists, do nothing
  if (!options.fail && !await exists(path)) {
    return;
  }

  await rm(path, {
    ...options,
    recursive: options?.recursive ?? true,
  });
};
