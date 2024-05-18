import { is } from "rcompat/invariant";
import { extend, proper } from "rcompat/object";

export default (object: object, defaults: object) => {
  is(object).object();
  is(defaults).object();

  if (proper(object)) {
    // here, `defaults` are the base while the object is the extension,
    // potentially overriding them (deeply)
    return extend(defaults, object);
  }
  return defaults;
};
