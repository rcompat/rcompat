import { extend, proper } from "rcompat/object";

export default (object, defaults) => {
  if (proper(object)) {
    // here, `defaults` are the base while the object is the extension,
    // potentially overriding them (deeply)
    return extend(defaults, object);
  }
  return defaults;
};
