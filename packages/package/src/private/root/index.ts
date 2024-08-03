import manifest_name from "#manifest-name";
import type { FileRef } from "@rcompat/fs/file";
import resolve from "@rcompat/fs/resolve";
import maybe from "@rcompat/invariant/maybe";

export default (relative_to?: string): Promise<FileRef> => {
  maybe(relative_to).string();

  return resolve(relative_to).discover(manifest_name);
};
