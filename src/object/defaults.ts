import { is } from "rcompat/invariant";
import { extend, proper } from "rcompat/object";

export default <T extends object, U extends object>(object: T, defaults: U): T & U => {
  const object_ = object ?? {};
  is(defaults).object();

  if (proper(object_)) {
    // here, `defaults` are the base while the object is the extension,
    // potentially overriding them (deeply)
    return extend(defaults, object_);
  }

  return defaults as never;
};
