import { FlatFile } from "rcompat/fs";
import manifest_name from "./manifest-name.js";

export default async (url: any) =>
  (await FlatFile.discover(url, manifest_name)).join(manifest_name).json();
