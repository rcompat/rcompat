import map from "@rcompat/object/map";

export interface ObjectKeyMapFunction {
  (key: string): string
}

export default<V>(object: Record<string, V>, mapper: ObjectKeyMapFunction): Record<string, V> =>
  map(object, ([key, value]) =>
    [mapper(key), value]);
