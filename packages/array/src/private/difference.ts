import assert from "@rcompat/assert";

export default (a: unknown[], b: unknown[]) => {
  assert.array(a);
  assert.array(b);

  return a.filter(member => !b.includes(member));
};
