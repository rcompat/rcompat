import FileRef, { type Path } from "@rcompat/fs/#/file-ref";

export default (...[first, ...rest]: [Path, ...Path[]]) => {
  const file = FileRef.new(first);
  return rest.length === 0 ? file : file.join(...rest);
}
