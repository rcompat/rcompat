import { is, maybe } from "rcompat/invariant";
import list from "./list.js";
import Kind from "../Kind.js";
import File from "../File.js";
import type { CollectPattern, DirectoryOptions } from "../types.js";

export type Def = (
  path: string
, pattern?: CollectPattern
, Options?: DirectoryOptions) => Promise<File[]>;

const collect = (async (path, pattern, options) => {
  let files: File[] = [];
  try {
    files = await list(path);
  } catch (_) {
    files = [];
  }

  let subfiles: File[] = [];
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
