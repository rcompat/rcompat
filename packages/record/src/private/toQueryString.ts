import Dict from "@rcompat/type/Dict";

export default function toQueryString(dict: Dict<string>) {
  return Object.entries(dict)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}
