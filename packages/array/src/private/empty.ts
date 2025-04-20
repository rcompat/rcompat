import is from "@rcompat/invariant/is";

export default (array: unknown[]): boolean => {
  is(array).array();

  return array.length === 0;
}
