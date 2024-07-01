import { copyFile, realpath } from "node:fs/promises";
import { is } from "@rcompat/invariant";
import { file, default as FlatFile } from "../FlatFile.js";
import Kind from "../Kind.js";
import { join } from "../static.js";
import type { DirectoryFilter } from "../types.js";
import kind from "./kind.js";
import list from "./list.js";

export type Def = (path: string, to: FlatFile, filter?: DirectoryFilter)
  => Promise<unknown>;

export default (async (path, to, filter = () => true) => {
  is(filter).function();

  const $kind = await kind(path);

  if ($kind === Kind.Link) {
    return file(await realpath(path)).copy(to, filter);
  }

  if ($kind === Kind.Directory) {
    // recreate directory if necessary
    await to.remove();
    await to.create();
    // copy all files
    return Promise.all((await list(path, filter))
      .map(({ name }) => join(path, name).copy(to.join(name))));
  }

  return copyFile(path, to.path);
}) as Def;
