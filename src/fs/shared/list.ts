import { readdir } from "node:fs/promises";
import { is, maybe } from "rcompat/invariant";
import FlatFile from "../FlatFile.js";
import type { DirectoryFilter } from "../types.js";

export type Def = (path: string, filter?: DirectoryFilter, Options?: {})
  => Promise<FlatFile[]>;

export default (async (path, filter = () => true, options) => {
  is(filter).function();
  maybe(options).object();

  const paths = await readdir(path, options);

  return paths.filter(filter).map(subpath => FlatFile.join(path, subpath));
}) as Def;
