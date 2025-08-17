import type { TransformOptions } from "esbuild";

const preset: TransformOptions = {
  jsx: "automatic",
  loader: "tsx",
  tsconfigRaw: {
    compilerOptions: {
      jsx: "react-jsx",
      jsxImportSource: "voby",
    },
  },
};

export { preset as default };
