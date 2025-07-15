import manifest_name from "#manifest-name";
import root from "#root";
import maybe from "@rcompat/assert/maybe";
import type Dict from "@rcompat/type/Dict";

export default async (from?: string): Promise<Dict> => {
  maybe(from).string();

  const manifest = await (await root(from)).join(manifest_name).json();

  return manifest as Dict;
};
