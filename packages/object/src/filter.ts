import transform from "./transform.js";

function filter<T, U extends T>(object: Record<string, T>, mapper: (entries: [key: string, value: T]) => entries is [key: string, value: U]): Record<string, U>;
function filter<T>(object: Record<string, T>, mapper: (entries: [key: string, value: T]) => boolean): Record<string, T>;
function filter(object: Record<string, unknown>, mapper: (entries: [key: string, value: unknown]) => boolean): Record<string, unknown> {
  return transform(object, entry =>
    entry.filter(mapper));
}

export default filter;