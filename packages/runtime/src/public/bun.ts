import type Runtime from "#Runtime";
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

const bun: Runtime = {
  name: "bun",
  bin: Bun.argv[0],
  script: Bun.argv[1],
  args: Bun.argv.slice(2),
  exit: (code?: number) => process.exit(code),
  resolve,
};

export default bun;
