import FileRef, { type Path } from "#FileRef";

export default (path: Path, filename: string) =>
  new FileRef(path).discover(filename);
