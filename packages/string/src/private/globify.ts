import assert from "@rcompat/assert";

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

export default (pattern: string) => {
  assert.string(pattern);

  return new RegExp(`^${globify(pattern)}$`, "u");
};

