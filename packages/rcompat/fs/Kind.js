const Kind = {
  File: "file",
  Directory: "directory",
  Link: "link",
  None: "none",
  is: {
    file: async file => await file.kind() === Kind.File,
    directory: async file => await file.kind() === Kind.Directory,
    link: async file => await file.kind() === Kind.Link,
  },
};

export default Kind;
