import { is } from "@rcompat/invariant";
import { identity } from "@rcompat/function";

export interface ObjectTransformFunction<T, U> {
  (entries: [key: string, value: T][]): [key: string, value: U][]
}

export default <T, U>(object: Record<string, T>, transformer: ObjectTransformFunction<T, U>): Record<string, U> => {
  const transformer_ = transformer ?? identity;

  is(object).object();
  is(transformer_).function();

  return Object.fromEntries(transformer_(Object.entries(object)));
};
