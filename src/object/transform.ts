import { is } from "rcompat/invariant";
import { identity } from "rcompat/function";

export default (object = {}, transformer = identity) => {
  is(object).object();
  is(transformer).function();

  return Object.fromEntries(transformer(Object.entries(object)));
};
