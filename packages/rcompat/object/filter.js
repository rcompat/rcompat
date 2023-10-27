import transform from "./transform.js";

export default (object, mapper) =>
  transform(object, entry =>
    entry.filter(mapper));
