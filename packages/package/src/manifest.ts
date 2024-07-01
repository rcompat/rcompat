import { maybe } from "@rcompat/invariant";
import root from "./root.js";
import manifest_name from "./manifest-name.js";

export default async (from?: string) => {
  maybe(from).string();
  
  return (await root(from)).join(manifest_name).json();
};
