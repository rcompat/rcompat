import { File } from "rcompat/fs";
import { maybe } from "rcompat/invariant";
import { manifest } from "rcompat/meta";

export default (relative_to?: string) => {
  maybe(relative_to).string();

  return File.resolve(relative_to).discover(manifest);
};
