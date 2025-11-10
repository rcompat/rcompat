import maybe from "@rcompat/assert/maybe";
import FileRef from "@rcompat/fs/FileRef";

export default (relative_to?: string): Promise<FileRef> => {
  maybe(relative_to).string();

  return FileRef.resolve(relative_to).discover("package.json");
};
