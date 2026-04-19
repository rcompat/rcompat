import common from "#common";
import type { Flags, Resolve } from "#Runtime";
import type { FileRef, Path } from "@rcompat/fs";
import fs from "@rcompat/fs";

type TSConfig = {
  compilerOptions?: {
    customConditions?: string[];
  };
  extends?: string;
};

async function read_tsconfig_conditions(
  resolve: Resolve,
  file: FileRef,
): Promise<string[]> {
  const json = await file.json<TSConfig>();
  if (json.compilerOptions?.customConditions?.length) {
    return json.compilerOptions.customConditions;
  }
  if (json.extends === undefined) {
    return [];
  }
  const next = resolve(json.extends, file.directory.path);
  return read_tsconfig_conditions(resolve, fs.ref(next));
}

async function conditions(
  resolve: Resolve,
  flags: Flags,
  from?: Path,
): Promise<string[]> {
  const root = from !== undefined ? fs.ref(from) : await common.projectRoot();

  // from --conditions flags
  const flag_conditions = flags.many("conditions");

  // from tsconfig.json
  const tsconfig = root.join("tsconfig.json");
  const tsconfig_conditions = await tsconfig.exists()
    ? await read_tsconfig_conditions(resolve, tsconfig)
    : [];

  return [...new Set([...flag_conditions, ...tsconfig_conditions])];
}

export default conditions;
