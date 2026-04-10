import type { Dict } from "@rcompat/type";

function values<T extends Dict>(dict: T): T[keyof T][] {
  return Object.values(dict) as T[keyof T][];
};

export default values;
