import platform from "@rcompat/platform";

const packagers = {
  bun: "bun",
  deno: "deno",
  node: "npm",
}

export default () => packagers[platform];
