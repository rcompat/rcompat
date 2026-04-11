import common from "#common";
import flags from "#flags";
import type Runtime from "#Runtime";
import dict from "@rcompat/dict";
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

const args = Deno.args;

const deno: Runtime = dict.new({
  name: "deno",
  bin: Deno.execPath(),
  script: Deno.mainModule,
  args,
  exit: (code?: number) => Deno.exit(code),
  resolve,
  flags: flags(args),
  ...common,
});

export default deno;
