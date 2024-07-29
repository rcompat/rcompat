import map from "@rcompat/object/map";

export interface ObjectValMapFunction<T, U> {
  (t: T): U;
}

export default <T, U>(object: Record<string, T>, mapper: ObjectValMapFunction<T, U>): Record<string, U> =>
  map(object, ([key, value]) =>
    [key, mapper(value)]);
