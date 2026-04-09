import type { FileRef } from "@rcompat/fs";
import type { PackageJSON } from "@rcompat/type";

export default interface Runtime {
  name: string;
  bin: string;
  script: string;
  args: string[];
  exit: (code?: number) => never;
  resolve: (specifier: string, from: string) => string;
  packageJSON: (from?: FileRef) => Promise<PackageJSON>;
  projectRoot: (from?: FileRef) => Promise<FileRef>;
}
