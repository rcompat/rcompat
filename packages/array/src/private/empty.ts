import is from "@rcompat/assert/is";

export default (array: unknown[]): boolean => {
  is(array).array();

  return array.length === 0;
};
