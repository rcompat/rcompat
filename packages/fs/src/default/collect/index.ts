import type { Path } from "@rcompat/fs/#/file-ref";
import type { CollectPattern, DirectoryOptions } from "@rcompat/fs/#/types";
import fileref from "@rcompat/fs/fileref";

export type CollectOptions = [CollectPattern, DirectoryOptions];

export default (path: Path, ...args: CollectOptions) =>
  fileref(path).collect(...args);
