import type Constructor from "@rcompat/type/Constructor";

export default function isConstructible(x: unknown) {
  try {
    Reflect.construct(String, [], x as Constructor);
    return true;
  } catch {
    return false;
  }
}
