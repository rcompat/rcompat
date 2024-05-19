import type { File } from "rcompat/fs";

const Kind = {
  File: "file",
  Directory: "directory",
  Link: "link",
  None: "none",
  is: {
    file: async (file: File) => await file.kind() === Kind.File,
    directory: async (file: File) => await file.kind() === Kind.Directory,
    link: async (file: File) => await file.kind() === Kind.Link,
  },
};

export default Kind;
