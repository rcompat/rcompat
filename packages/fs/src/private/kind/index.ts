import type FileRef from "@rcompat/fs/#/file-ref";

const Kind = {
  File: "file",
  Directory: "directory",
  Link: "link",
  None: "none",
  is: {
    file: async (file: FileRef) => await file.kind() === Kind.File,
    directory: async (file: FileRef) => await file.kind() === Kind.Directory,
    link: async (file: FileRef) => await file.kind() === Kind.Link,
  },
};

export default Kind;
