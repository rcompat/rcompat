import { is } from "rcompat/invariant";
import { identity } from "rcompat/function";
import from from "./from.js";
import to from "./to.js";

export default (object = {}, transformer = identity) => {
  is(object).object();
  is(transformer).function();
  return from(transformer(to(object)));
};
