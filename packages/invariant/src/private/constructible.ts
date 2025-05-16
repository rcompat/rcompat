import type Constructor from "@rcompat/type/Constructor";

export default (value: unknown): boolean => {
  try {
    Reflect.construct(String, [], value as Constructor);
    return true;
  } catch {
    return false;
  }
};
