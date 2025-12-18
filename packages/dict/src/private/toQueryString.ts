import type { Dict } from "@rcompat/type";

export default function toQueryString(dict: Dict<string>) {
  return Object.entries(dict)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}
