import { is } from "rcompat/invariant";

const globify = (pattern: string) => pattern
  // . -> real dots need escaping
  .replaceAll(".", "\\.")
  // . -> real dots need escaping
  .replaceAll("?", ".")
  // /**/ -> / and then anything
  .replaceAll("/**/", "/(.*)")
  // ** -> anything, including /
  .replaceAll("**", ".*")
  // ignore previously replaced ** -> anything aside from /
  .replace(/(?<!\.)\*/u, "[^/]*")
  // * may be standalone -> anything aside from /
  .replace(/(?<=\\)\.\*/u, ".[^/]*")
;

export default (pattern: unknown) => {
  // Todo: Fix when invariant is ported
  is(pattern).string(); // If this doesn't throw, we know it's a string, just type assert next line
  return new RegExp(`^${globify(pattern as string)}$`, "u");
};

