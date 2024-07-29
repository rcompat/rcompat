import FileRef from "@rcompat/fs/#/file-ref";
import Kind from "@rcompat/fs/#/kind";
import type { DirectoryFilter } from "@rcompat/fs/#/types";
import join from "@rcompat/fs/join";
import kind from "./kind.js";
import list from "./list.js";
import is from "@rcompat/invariant/is";
import { copyFile, realpath } from "node:fs/promises";

export type Def = (path: string, to: FileRef, filter?: DirectoryFilter)
  => Promise<unknown>;

export default (async (path, to, filter = () => true) => {
  is(filter).function();

  const $kind = await kind(path);

  if ($kind === Kind.Link) {
    return new FileRef(await realpath(path)).copy(to, filter);
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
