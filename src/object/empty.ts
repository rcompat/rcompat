import { maybe } from "rcompat/invariant";

export default (object?: object): boolean => {
  maybe(object).object();

  return Object.keys(object ?? {}).length === 0;
}
