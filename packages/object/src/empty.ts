import { is } from "@rcompat/invariant";

export default (object: object): boolean => {
  is(object).object();

  return Object.keys(object).length === 0;
}
