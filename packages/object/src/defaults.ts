import { is } from "@rcompat/invariant";
import extend from "./extend.js";
import { default as proper } from "./proper.js";
import type { Proper } from "@rcompat/object/types";

export default <T extends Proper, U extends Proper>(object: T, defaults: U): T & U => {
  is(object).object();
  is(defaults).object();

  if (proper(object)) {
    // here, `defaults` are the base while the object is the extension,
    // potentially overriding them (deeply)
    return extend(defaults, object);
  }

  return defaults as never;
};
