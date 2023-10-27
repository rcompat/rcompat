import { is } from "rcompat/invariant";

const impl1 = by => (path, initial) => impl3(path, initial, by);

const impl3 = (path, initial = {}, by = ".") => {
  is(path).string();
  is(initial).object();
  is(by).string();
  return path.split(by).reduceRight((depathed, key) =>
    ({ [key]: depathed }), initial);
};

export default (arg0, ...args) =>
  args.length === 0 ? impl1(arg0) : impl3(arg0, ...args);
