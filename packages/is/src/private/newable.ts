import type { Newable, UnknownFunction } from "@rcompat/type";

export default function isNewable(x: unknown): x is Newable {
  if (typeof x !== "function") return false;

  try {
    Reflect.construct(String, [], x as UnknownFunction);
    return true;
  } catch {
    return false;
  }
}
