import transform from "./transform.js";

export default (object, mapper) =>
  transform(object, entry =>
    entry.map(mapper));
