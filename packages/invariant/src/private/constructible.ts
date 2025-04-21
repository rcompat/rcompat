import type ConstructibleFunction from "@rcompat/type/ConstructibleFunction";

export default (value: unknown): boolean => {
  try {
    Reflect.construct(String, [], value as ConstructibleFunction);
    return true;
  } catch {
    return false;
  }
};
