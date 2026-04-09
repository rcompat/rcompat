import type { Path } from "@rcompat/fs";
import fs from "@rcompat/fs";
import type { PackageJSON } from "@rcompat/type";

async function root(from: Path = fs.cwd()) {
  return fs.ref(from).discover("package.json");
}

async function packageJSON(from: Path = fs.cwd()): Promise<PackageJSON> {
  return (await root(fs.ref(from))).join("package.json").json<PackageJSON>();
}

export default {
  projectRoot: root,
  packageJSON,
};
