import type Dict from "#Dict";
import type JSONValue from "#JSONValue";

type TypeURL = {
  type?: string;
  url: string;
};

type Person = string | {
  name?: string;
  email?: string;
  url?: string;
};

type Funding = string | TypeURL;

type PackageJSON = {
  name?: string;
  version?: string;
  description?: string;
  keywords?: string[];
  homepage?: string;
  bugs?: string | {
    url?: string;
    email?: string;
  };
  license?: string;
  author?: Person;
  contributors?: Person[];
  funding?: Funding | Funding[];
  files?: string[];
  exports?: string | string[] | JSONValue;
  imports?: JSONValue;
  main?: string;
  type?: "module" | "commonjs";
  browser?: string;
  bin?: string | JSONValue;
  man?: string | string[];
  directories?: JSONValue;
  repository?: string | TypeURL & { directory?: string };
  scripts?: JSONValue;
  gypfile?: boolean;
  config?: JSONValue;
  dependencies?: JSONValue;
  devDependencies?: JSONValue;
  peerDependencies?: JSONValue;
  peerDependenciesMeta?: Dict<{ optional: boolean }>;
  bundleDependencies?: string[] | boolean;
  bundledDependencies?: string[] | boolean;
  optionalDependencies?: JSONValue;
  overrides?: JSONValue;
  engines?: JSONValue;
  os?: string[];
  cpu?: string[];
  libc?: string[];
  devEngines?: JSONValue;
  private?: boolean;
  publishConfig?: JSONValue;
  workspaces?: string[];
};

export type { PackageJSON as default };
