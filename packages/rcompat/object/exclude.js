import { is } from "rcompat/invariant";
import filter from "./filter.js";

export default (object = {}, excludes = []) => {
  is(object).object();
  is(excludes).array();

  return filter(object, entry => !excludes.includes(entry[0]));
};
