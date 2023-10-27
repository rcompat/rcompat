import { is } from "rcompat/invariant";

const globify = pattern => pattern
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

export default pattern => {
  is(pattern).string();
  return new RegExp(`^${globify(pattern)}$`, "u");
};

