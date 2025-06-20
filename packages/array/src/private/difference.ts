import is from "@rcompat/assert/is";

export default (a: unknown[], b: unknown[]) => {
  is(a).array();
  is(b).array();

  return a.filter(member => !b.includes(member));
};
