import { is } from "@rcompat/invariant";

export default (a: unknown[], b: unknown[]) => {
  is(a).array();
  is(b).array();

  return a.filter(member => !b.includes(member));
}
