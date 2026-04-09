import type { FileRef } from "@rcompat/fs";
import fs from "@rcompat/fs";
import type { PackageJSON } from "@rcompat/type";

async function root(from: FileRef = fs.cwd()) {
  return from.discover("package.json");
}

async function packageJSON(from: FileRef = fs.cwd()): Promise<PackageJSON> {
  return (await root(from)).join("package.json").json<PackageJSON>();
}

export default {
  projectRoot: root,
  packageJSON,
};
