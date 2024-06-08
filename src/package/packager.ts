import platform from "./platform.js";

const packagers = {
  bun: "bun",
  deno: "deno",
  node: "npm",
}

export default () => packagers[platform()];
