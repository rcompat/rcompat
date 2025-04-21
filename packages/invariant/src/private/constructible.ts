import type Constructible from "@rcompat/type/Constructible";

export default (value: unknown): boolean => {
  try {
    Reflect.construct(String, [], value as Constructible);
    return true;
  } catch {
    return false;
  }
};
