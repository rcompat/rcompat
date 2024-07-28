import FileRef, { type Path } from "@rcompat/fs/#/file-ref";

export default (path: Path) => FileRef.new(path).webpath();
