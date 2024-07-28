import fileref from "@rcompat/fs/fileref";

export default (pattern: string) => fileref(".").glob(pattern);
