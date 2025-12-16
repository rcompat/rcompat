import assert from "@rcompat/assert";
import FileRef from "@rcompat/fs/FileRef";

export default (relative_to?: string): Promise<FileRef> => {
  assert.maybe.string(relative_to);

  return FileRef.resolve(relative_to).discover("package.json");
};
