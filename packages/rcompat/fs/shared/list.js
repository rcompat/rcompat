import { readdir } from "node:fs/promises";
import { is, maybe } from "rcompat/invariant";
import File from "../File.js";

export default (path, filter = () => true, options = {}) => {

  maybe(options).object();
  is(filter).function();

  return readdir(path, options).then(paths => paths
    .filter(filter)
    .map(subpath => File.join(path, subpath)));
};
