import { transform } from "esbuild";

const make_options = (options = {}) => {
  const { tsconfig, ...rest } = options;

  return tsconfig
    ? { tsconfigRaw: JSON.stringify(tsconfig), ...rest }
    : rest;
};

export default (text, options) => transform(text, make_options(options));
