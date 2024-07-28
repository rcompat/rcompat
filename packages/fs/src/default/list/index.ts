import file from "@rcompat/fs/file";
import FileRef, { type Path } from "@rcompat/fs/#/file-ref";
import type { DirectoryFilter } from "@rcompat/fs/#/types";

export default (path: Path, filter: DirectoryFilter, options: {}) =>
  file(path).list(filter, options);
