import fileref from "@rcompat/fs/fileref";
import FileRef, { type Path } from "@rcompat/fs/#/file-ref";
import type { DirectoryFilter } from "@rcompat/fs/#/types";

export default (path: Path, filter: DirectoryFilter, options: {}) =>
  fileref(path).list(filter, options);
