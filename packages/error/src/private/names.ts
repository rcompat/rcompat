import type { Dict } from "@rcompat/type";

function names<T extends Dict>(dict: T) {
  return Object.fromEntries(Object.keys(dict)
    .map(k => [k, k])) as { [K in keyof T]: K };
}

export default names;
