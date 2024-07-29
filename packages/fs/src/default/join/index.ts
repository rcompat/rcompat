import FileRef, { type Path } from "#FileRef";

export default (...[first, ...rest]: [Path, ...Path[]]) => {
  const file = FileRef.new(first);
  return rest.length === 0 ? file : file.join(...rest);
}
