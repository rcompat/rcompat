import file from "@rcompat/fs/file";

export default (pattern: string) => file(".").glob(pattern);
