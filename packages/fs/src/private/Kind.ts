import type FileRef from "#FileRef";

const Kind = {
  Directory: "directory",
  File: "file",
  is: {
    directory: async (file: FileRef) => await file.kind() === Kind.Directory,
    file: async (file: FileRef) => await file.kind() === Kind.File,
    link: async (file: FileRef) => await file.kind() === Kind.Link,
  },
  Link: "link",
  None: "none",
};

export default Kind;
