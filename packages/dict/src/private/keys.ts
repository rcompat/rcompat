import type { Dict } from "@rcompat/type";

function keys<T extends Dict>(dict: T): (keyof T)[] {
  return Object.keys(dict) as (keyof T)[];
};

export default keys;
