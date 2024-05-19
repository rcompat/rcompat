export default (path: string) => Bun.file(path).stream();

