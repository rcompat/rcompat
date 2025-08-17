import reload_path from "#reload/path";
import type * as esbuild from "esbuild";

const default_name = "app";

export const dev = "development";
export const prod = "production";

export default {
  [dev]: (name = default_name): esbuild.BuildOptions => ({
    banner: {
      js: `new EventSource("${reload_path}").addEventListener("change",
        () => globalThis.location.reload());`,
    },
    entryNames: name,
    minify: false,
    splitting: false,
  }),
  [prod]: (name = default_name): esbuild.BuildOptions => ({
    banner: {},
    entryNames: `${name}-[hash]`,
    minify: true,
    splitting: true,
  }),
};
