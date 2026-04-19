import type { FileRef, Path } from "@rcompat/fs";
import type { Arch, Bag, OS, PackageJSON } from "@rcompat/type";

export type Resolve = (specifier: string, from: string) => string;
export type Flags = Bag & { many(key: string): string[] };

export default interface Runtime {
  name: string;
  bin: string;
  script: string;
  cwd: () => FileRef;
  args: string[];
  exit: (code?: number) => never;
  resolve: Resolve;
  toRequire: (path: Path) => NodeJS.Require;
  packageJSON: (from?: Path) => Promise<PackageJSON>;
  projectRoot: (from?: Path) => Promise<FileRef>;
  conditions: (from?: Path) => Promise<string[]>;
  flags: Flags;
  os: OS | undefined;
  arch: Arch | undefined;
}
