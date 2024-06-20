import type { FlatFile } from "rcompat/fs";

const Kind = {
  File: "file",
  Directory: "directory",
  Link: "link",
  None: "none",
  is: {
    file: async (file: FlatFile) => await file.kind() === Kind.File,
    directory: async (file: FlatFile) => await file.kind() === Kind.Directory,
    link: async (file: FlatFile) => await file.kind() === Kind.Link,
  },
};

export default Kind;
