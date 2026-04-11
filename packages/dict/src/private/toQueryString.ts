import assert from "@rcompat/assert";
import type { Dict } from "@rcompat/type";

function toQueryString(dict: Dict<string>) {
  assert.dict(dict);

  return Object.entries(dict)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}

export default toQueryString;
