import type { FileRef, Path } from "@rcompat/fs";
import type { Bag, PackageJSON } from "@rcompat/type";

export default interface Runtime {
  name: string;
  bin: string;
  script: string;
  args: string[];
  exit: (code?: number) => never;
  resolve: (specifier: string, from: string) => string;
  toRequire: (path: Path) => NodeJS.Require;
  packageJSON: (from?: Path) => Promise<PackageJSON>;
  projectRoot: (from?: Path) => Promise<FileRef>;
  flags: Bag & { many(key: string): string[] };
}
