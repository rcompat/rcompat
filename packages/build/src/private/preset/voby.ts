import type { TransformOptions } from "esbuild";

const preset: TransformOptions = {
  loader: "tsx",
  jsx: "automatic",
  tsconfigRaw: {
    compilerOptions: {
      jsx: "react-jsx",
      jsxImportSource: "voby",
    },
  },
};

export { preset as default };
