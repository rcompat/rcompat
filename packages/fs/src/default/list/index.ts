import FileRef, { type Path } from "#FileRef";
import type { DirectoryFilter } from "#types";

export default (path: Path, filter: DirectoryFilter, options: {}) =>
  FileRef.new(path).list(filter, options);
