import common from "#common";
import flags from "#flags";
import type Runtime from "#Runtime";
import dict from "@rcompat/dict";
import path from "node:path";

function resolve(specifier: string, from: string) {
  if (specifier.startsWith("./")
    || specifier.startsWith("../")
    || specifier.startsWith("/")
  ) {
    return path.resolve(from, specifier);
  }

  return Bun.resolveSync(specifier, from);
}

const args = Bun.argv.slice(2);

const bun: Runtime = dict.new({
  name: "bun",
  bin: Bun.argv[0],
  script: Bun.argv[1],
  args,
  exit: (code?: number) => process.exit(code),
  resolve,
  flags: flags(args),
  ...common,
});

export default bun;
