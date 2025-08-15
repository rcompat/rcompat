import type Newable from "@rcompat/type/Newable";
import type UnknownFunction from "@rcompat/type/UnknownFunction";

export default function isNewable(x: unknown): x is Newable {
  if (typeof x !== "function") return false;

  try {
    Reflect.construct(String, [], x as UnknownFunction);
    return true;
  } catch {
    return false;
  }
}
