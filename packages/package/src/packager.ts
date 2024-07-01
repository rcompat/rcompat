import { platform } from "@rcompat/core";

const packagers = {
  bun: "bun",
  deno: "deno",
  node: "npm",
}

export default () => packagers[platform()];
