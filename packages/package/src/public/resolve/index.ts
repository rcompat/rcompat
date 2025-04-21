import manifest_name from "#manifest-name";
import FileRef from "@rcompat/fs/FileRef";

export default async (url: string) =>
  (await FileRef.discover(url, manifest_name)).join(manifest_name).json();
