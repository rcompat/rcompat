import { resolve } from "@rcompat/fs";
import maybe from "@rcompat/invariant/maybe";
import manifest_name from "@rcompat/package/manifest-name";

export default (relative_to?: string) => {
  maybe(relative_to).string();

  return resolve(relative_to).discover(manifest_name);
};
