import { File } from "rcompat/fs";
import { manifest } from "rcompat/meta";

export default async (url: any) =>
  (await File.discover(url, manifest)).join(manifest).json();
