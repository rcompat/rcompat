import { maybe } from "rcompat/invariant";
import { manifest } from "rcompat/meta";
import root from "./root.js";

export default async (from?: string) => {
  maybe(from).string();
  
  return (await root(from)).join(manifest).json();
}
