import FileRef from "#FileRef";

export default (pattern: string) => new FileRef(".").glob(pattern);
