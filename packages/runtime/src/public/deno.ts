import type Runtime from "#Runtime";
import { createRequire } from "node:module";
import path from "node:path";

function resolve(specifier: string, from: string) {
  if (
    specifier.startsWith("./")
    || specifier.startsWith("../")
    || specifier.startsWith("/")
  ) {
    return path.resolve(from, specifier);
  }

  return createRequire(path.join(from, "package.json")).resolve(specifier);
}

const deno: Runtime = {
  name: "deno",
  bin: Deno.execPath(),
  script: Deno.mainModule,
  args: Deno.args,
  exit: (code?: number) => Deno.exit(code),
  resolve,
};

export default deno;
