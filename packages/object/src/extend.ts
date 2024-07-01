import { is } from "@rcompat/invariant";

const extend = <T extends object, U extends object>(base: T, extension: U): T & U => {
  const base_ = base ?? {}
  const extension_ = extension ?? {}

  if (!(!!base_ && typeof base_ === "object")) {
    return base_;
  }
  is(extension_).object();
  return (Object.keys(extension_) as (keyof (U & T))[]) .reduce((result, property) => {
    const value = extension_[property as keyof U];
    return {
      ...result,
      [property]: value?.constructor === Object
        ? extend(base_[property as keyof T] as object, value)
        : value,
    };
  }, base_) as never;
};

export default extend;
