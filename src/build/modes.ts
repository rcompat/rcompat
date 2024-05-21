import * as esbuild from "esbuild";

const default_name = "app";
export const dev = "development";
export const prod = "production";
import { event_path } from "./hotreload.js";

export default {
  [dev]: (name = default_name): esbuild.BuildOptions => ({
    minify: false,
    splitting: false,
    banner: {
      js: `new EventSource("${event_path}").addEventListener("change",
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
