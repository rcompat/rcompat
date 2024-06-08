import { File } from "rcompat/fs";
import manifest_name from "./manifest-name.js";

export default async (url: any) =>
  (await File.discover(url, manifest_name)).join(manifest_name).json();
