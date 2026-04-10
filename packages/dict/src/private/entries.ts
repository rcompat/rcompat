import type { Dict } from "@rcompat/type";

function entries<T extends Dict>(dict: T): [keyof T, T[keyof T]][] {
  return Object.entries(dict) as [keyof T, T[keyof T]][];
};

export default entries;
