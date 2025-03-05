import FileRef, { type Path } from "#FileRef";

export default (...[first, ...rest]: [Path, ...Path[]]) => {
  const file = new FileRef(first);
  return rest.length === 0 ? file : file.join(...rest);
}
