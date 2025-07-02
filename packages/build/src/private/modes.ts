import reload_path from "#reload/path";
import type * as esbuild from "esbuild";

const default_name = "app";

export const dev = "development";
export const prod = "production";

export default {
  [dev]: (name = default_name): esbuild.BuildOptions => ({
    minify: false,
    splitting: false,
    banner: {
      js: `new EventSource("${reload_path}").addEventListener("change",
        () => globalThis.location.reload());`,
    },
    entryNames: name,
  }),
  [prod]: (name = default_name): esbuild.BuildOptions => ({
    minify: true,
    splitting: true,
    banner: {},
    entryNames: `${name}-[hash]`,
  }),
};
