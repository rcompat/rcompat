import transform from "@rcompat/object/transform";

export interface ObjectMapFunction<T, U> {
  (entries: [key: string, value: T]): [key: string, value: U];
}

export default <T, U>(object: Record<string, T>, mapper: ObjectMapFunction<T, U>): Record<string, U> =>
  transform(object, entry =>
    entry.map(mapper));
