import { File } from "rcompat/fs";
import { manifest } from "rcompat/meta";

const resolve = async (url: string): Promise<unknown> =>
  (await File.discover(url, manifest)).join(manifest).json();

export { resolve };
