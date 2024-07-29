import FileRef from "#FileRef";

export default (pattern: string) => FileRef.new(".").glob(pattern);
