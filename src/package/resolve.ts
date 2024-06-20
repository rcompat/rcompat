import { discover } from "rcompat/fs";
import manifest_name from "./manifest-name.js";

export default async (url: any) =>
  (await discover(url, manifest_name)).join(manifest_name).json();
