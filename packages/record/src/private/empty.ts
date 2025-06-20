import is from "@rcompat/assert/is";

export default (object: object): boolean => {
  is(object).object();

  return Object.keys(object).length === 0;
};
