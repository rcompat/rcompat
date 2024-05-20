import { is } from "rcompat/invariant";
import filter from "./filter.js";

export default <T extends object, E extends readonly string[]>(object: T, excludes: E): Omit<T, E[number]> => {
  is(object).object();
  is(excludes).array();

  return filter(object as Record<string, unknown>, entry => !excludes.includes(entry[0])) as never;
};
