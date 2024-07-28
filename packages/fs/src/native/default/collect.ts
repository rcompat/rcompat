import FileRef from "@rcompat/fs/#/file-ref";
import Kind from "@rcompat/fs/#/kind";
import type { CollectPattern, DirectoryOptions } from "@rcompat/fs/#/types";
import list from "@rcompat/fs/native/list";
import is from "@rcompat/invariant/is";
import maybe from "@rcompat/invariant/maybe";

export type Def = (
  path: string
, pattern?: CollectPattern
, Options?: DirectoryOptions) => Promise<FileRef[]>;

const collect = (async (path, pattern, options) => {
  let files: FileRef[] = [];
  try {
    files = await list(path);
  } catch (_) {
    files = [];
  }

  let subfiles: FileRef[] = [];
  for (const file of files) {
    if (file.name.startsWith(".")) {
      continue;
    }
    if (options?.recursive && await file.kind() === Kind.Directory) {
      subfiles = subfiles.concat(await file.collect(pattern, options));
    } else if (pattern === undefined ||
        new RegExp(pattern, "u").test(file.path)) {
      subfiles.push(file);
    }
  }
  return subfiles;
}) as Def;

export default ((path, pattern, options) => {
  is(path).string();
  maybe(pattern).anyOf(["string", RegExp]);
  maybe(options).object();

  return collect(path, pattern, {
    ...options,
    recursive: options?.recursive ?? true,
  });
}) as Def;
