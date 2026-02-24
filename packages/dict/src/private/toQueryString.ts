import is from "@rcompat/is";
import type { Dict } from "@rcompat/type";

export default function toQueryString(dict: Dict<string>) {
  is.dict(dict);

  return Object.entries(dict)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}
