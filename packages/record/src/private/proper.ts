export type Proper = NonNullable<object>;

export default (record: unknown): record is Proper =>
  typeof record === "object" && record !== null;
