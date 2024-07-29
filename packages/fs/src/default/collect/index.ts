import type { Path } from "#FileRef";
import type { CollectPattern, DirectoryOptions } from "#types";
import file from "@rcompat/fs/file";

export type CollectOptions = [CollectPattern, DirectoryOptions];

export default (path: Path, ...args: CollectOptions) =>
  file(path).collect(...args);
