import maybe from "@rcompat/invariant/maybe";
import manifest_name from "@rcompat/package/manifest-name";
import root from "@rcompat/package/root";

export default async (from?: string) => {
  maybe(from).string();
  
  return (await root(from)).join(manifest_name).json();
};
