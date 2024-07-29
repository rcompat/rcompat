import FileRef, { type Path } from "#FileRef";

export default (path: Path, filename: string) =>
  FileRef.new(path).discover(filename);
