export type Proper = NonNullable<object>;

export default (object: unknown): object is Proper =>
  typeof object === "object" && object !== null;
