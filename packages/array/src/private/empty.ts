import assert from "@rcompat/assert";

export default (array: unknown[]): boolean => {
  assert.array(array);

  return array.length === 0;
};
