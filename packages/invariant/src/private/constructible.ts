import type Instance from "@rcompat/type/Instance";

export default (value: unknown): boolean => {
  try {
    Reflect.construct(String, [], value as Instance);
    return true;
  } catch {
    return false;
  }
};
