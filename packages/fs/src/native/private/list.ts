import FileRef from "#FileRef";
import type { DirectoryFilter } from "#types";
import join from "@rcompat/fs/join";
import is from "@rcompat/invariant/is";
import maybe from "@rcompat/invariant/maybe";
import { readdir } from "node:fs/promises";

export type Def = (path: string, filter?: DirectoryFilter, Options?: {})
  => Promise<FileRef[]>;

export default (async (path, filter = () => true, options) => {
  is(filter).function();
  maybe(options).object();

  const paths = await readdir(path, options);

  return paths.filter(filter).map(subpath => join(path, subpath));
}) as Def;
