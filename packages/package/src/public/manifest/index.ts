import manifest_name from "#manifest-name";
import root from "#root";
import maybe from "@rcompat/invariant/maybe";

export default async (from?: string) => {
  maybe(from).string();
  
  return (await root(from)).join(manifest_name).json();
};
