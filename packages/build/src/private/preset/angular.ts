import type { TransformOptions } from "esbuild";

const preset: TransformOptions = {
  loader: "ts",
  tsconfigRaw: {
    compilerOptions: {
      experimentalDecorators: true,
    },
  },
};

export { preset as default };
