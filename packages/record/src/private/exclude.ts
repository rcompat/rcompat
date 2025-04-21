import is from "@rcompat/invariant/is";
import entries from "@rcompat/record/entries";

export default <T extends object, const E extends keyof T>
  (object: T, excludes: readonly E[]): Omit<T, E> => {
    is(object).object();
    is(excludes).array();

    return entries(object)
      .filter(entry => !excludes.includes(entry[0] as E))
      .get() as never;
};
