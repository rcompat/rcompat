import { readdir } from "node:fs/promises";
import is from "@rcompat/invariant/is";
import maybe from "@rcompat/invariant/maybe";
import FlatFile from "../FlatFile.js";
import { join } from "../static.js";
import type { DirectoryFilter } from "../types.js";

export type Def = (path: string, filter?: DirectoryFilter, Options?: {})
  => Promise<FlatFile[]>;

export default (async (path, filter = () => true, options) => {
  is(filter).function();
  maybe(options).object();

  const paths = await readdir(path, options);

  return paths.filter(filter).map(subpath => join(path, subpath));
}) as Def;
