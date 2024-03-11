import map from "./map.js";

export default (object, mapper) =>
  map(object, ([key, value]) =>
    [key, mapper(value)]);
