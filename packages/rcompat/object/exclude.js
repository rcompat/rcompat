import filter from "./filter.js";

export default (object, excludes) =>
  filter(object, entry => !excludes.includes(entry[0]));
