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

const args = process.argv.slice(2);

const node: Runtime = dict.new({
  name: "node",
  bin: process.execPath,
  script: process.argv[1],
  args,
  flags: flags(args),
  exit: (code?: number) => process.exit(code),
  resolve,
  ...common,
});

export default node;
