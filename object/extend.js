import { is } from "rcompat/invariant";

const extend = (base = {}, extension = {}) => {
  if (typeof base !== "object") {
    return base;
  }
  is(extension).object();
  return Object.keys(extension).reduce((result, property) => {
    const value = extension[property];
    return {
      ...result,
      [property]: value?.constructor === Object
        ? extend(base[property], value)
        : value,
    };
  }, base);
};

export default extend;
