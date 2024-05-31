import { is } from "rcompat/invariant";
import { identity } from "rcompat/function";

export interface ObjectTransformFunction<T, U> {
  (entries: [key: string, value: T][]): [key: string, value: U][]
}

// @ts-ignore
export default <T, U>(object: Record<string, T> = {}, transformer: ObjectTransformFunction<T, U> = identity): Record<string, U> => {
  is(object).object();
  is(transformer).function();

  return Object.fromEntries(transformer(Object.entries(object)));
};
