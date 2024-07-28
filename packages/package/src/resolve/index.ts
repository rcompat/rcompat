import { discover } from "@rcompat/fs";
import manifest_name from "@rcompat/package/manifest-name";

export default async (url: any) =>
  (await discover(url, manifest_name)).join(manifest_name).json();
