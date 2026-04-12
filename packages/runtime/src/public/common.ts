import type Runtime from "#Runtime";
import type { Path } from "@rcompat/fs";
import fs from "@rcompat/fs";
import type { PackageJSON } from "@rcompat/type";
import { createRequire } from "node:module";

type Common = Pick<Runtime, "projectRoot" | "packageJSON" | "toRequire">;

async function root(from: Path = fs.cwd()) {
  return fs.ref(from).discover("package.json");
}

async function packageJSON(from: Path = fs.cwd()): Promise<PackageJSON> {
  return (await root(fs.ref(from))).join("package.json").json<PackageJSON>();
}

const common: Common = {
  toRequire(path: Path) {
    return createRequire(fs.ref(path).path);
  },
  projectRoot: root,
  packageJSON,
};

export default common;
