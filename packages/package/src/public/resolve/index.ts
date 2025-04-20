import discover from "@rcompat/fs/discover";
import manifest_name from "#manifest-name";

export default async (url: string) =>
  (await discover(url, manifest_name)).join(manifest_name).json();
