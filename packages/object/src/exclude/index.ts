import is from "@rcompat/invariant/is";
import filter from "@rcompat/object/filter";

export default <T extends object, const E extends keyof T>(object: T, excludes: readonly E[]): Omit<T, E> => {
  is(object).object();
  is(excludes).array();

  return filter(object as Record<string, unknown>, entry => !excludes.includes(entry[0] as E)) as never;
};
