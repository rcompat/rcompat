import FileRef, { type Path } from "@rcompat/fs/#/file-ref";

export default (path: Path, filename: string) =>
  FileRef.new(path).discover(filename);
