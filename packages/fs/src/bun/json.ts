export default (path: string): Promise<unknown> => Bun.file(path).json();
