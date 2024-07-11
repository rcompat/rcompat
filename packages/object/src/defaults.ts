import { is } from "@rcompat/invariant";
import extend from "./extend.js";
import proper from "./proper.js";

export default <T extends object, U extends object>(object: T, defaults: U): T & U => {
  is(object).object();
  is(defaults).object();

  if (proper(object)) {
    // here, `defaults` are the base while the object is the extension,
    // potentially overriding them (deeply)
    return extend(defaults, object);
  }

  return defaults as never;
};
