import common from "#common";
import conditions from "#conditions";
import flags_bag from "#flags";
import type Runtime from "#Runtime";
import dict from "@rcompat/dict";
import type { Path } from "@rcompat/fs";
import fs from "@rcompat/fs";
import type { Arch, Dict, OS } from "@rcompat/type";
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

const oses: Dict<OS> = {
  linux: "linux",
  darwin: "darwin",
  win32: "windows",
};

const archs: Dict<Arch> = {
  x64: "x64",
  arm64: "arm64",
};

const flags = flags_bag(args);

const node: Runtime = dict.new({
  name: "node",
  bin: process.execPath,
  script: process.argv[1],
  cwd: () => fs.ref(process.cwd()),
  args,
  os: oses[process.platform],
  arch: archs[process.arch],
  flags,
  exit: (code?: number) => process.exit(code),
  resolve,
  conditions: (from?: Path) => conditions(resolve, flags, from),
  ...common,
});

export default node;
