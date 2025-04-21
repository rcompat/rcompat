import manifest_name from "#manifest-name";
import FileRef from "@rcompat/fs/FileRef";
import maybe from "@rcompat/invariant/maybe";

export default (relative_to?: string): Promise<FileRef> => {
  maybe(relative_to).string();

  return FileRef.resolve(relative_to).discover(manifest_name);
};
