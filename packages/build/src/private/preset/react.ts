import type { TransformOptions } from "esbuild";

const preset: TransformOptions = {
  loader: "tsx",
  jsx: "automatic",
};

export { preset as default };
