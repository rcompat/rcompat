import { transform } from "esbuild";

type Options = {
  tsconfig?: object
}

const make_options = (options: Options = {}) => {
  const { tsconfig, ...rest } = options;

  return tsconfig !== undefined
    ? { tsconfigRaw: JSON.stringify(tsconfig), ...rest }
    : rest;
};

export default (text: string, options: Options) =>
  transform(text, make_options(options));
