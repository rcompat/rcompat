import resolve from "@rcompat/fs/resolve";
import maybe from "@rcompat/invariant/maybe";
import manifest_name from "@rcompat/package/manifest-name";
import type { FileRef } from "@rcompat/fs/file";

export default (relative_to?: string): Promise<FileRef> => {
  maybe(relative_to).string();

  return resolve(relative_to).discover(manifest_name);
};
