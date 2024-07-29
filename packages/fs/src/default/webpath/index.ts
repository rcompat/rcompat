import FileRef, { type Path } from "#FileRef";

export default (path: Path) => FileRef.new(path).webpath();
