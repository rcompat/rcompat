import { maybe } from "@rcompat/invariant";
import root from "@rcompat/package/root";
import manifest_name from "@rcompat/package/manifest-name";

export default async (from?: string) => {
  maybe(from).string();
  
  return (await root(from)).join(manifest_name).json();
};
