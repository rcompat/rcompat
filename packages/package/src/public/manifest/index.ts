import manifest_name from "#manifest-name";
import root from "#root";
import maybe from "@rcompat/invariant/maybe";
import type Dictionary from "@rcompat/type/Dictionary";

export default async (from?: string): Promise<Dictionary> => {
  maybe(from).string();

  const manifest = await (await root(from)).join(manifest_name).json();

  return manifest as Dictionary;
};
