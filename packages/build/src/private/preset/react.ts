import type { TransformOptions } from "esbuild";

const preset: TransformOptions = {
  jsx: "automatic",
  loader: "tsx",
};

export { preset as default };
