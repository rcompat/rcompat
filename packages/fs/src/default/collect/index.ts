import FileRef, { type Path } from "#FileRef";
import type { CollectPattern, DirectoryOptions } from "#types";

export type CollectOptions = [CollectPattern, DirectoryOptions];

export default (path: Path, ...args: CollectOptions) =>
  new FileRef(path).collect(...args);
