import type { Path } from "@rcompat/fs/#/file-ref";
import type { CollectPattern, DirectoryOptions } from "@rcompat/fs/#/types";
import file from "@rcompat/fs/file";

export type CollectOptions = [CollectPattern, DirectoryOptions];

export default (path: Path, ...args: CollectOptions) =>
  file(path).collect(...args);
