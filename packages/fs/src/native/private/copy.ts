import FileRef from "#FileRef";
import Kind from "#Kind";
import kind from "#native/kind";
import list from "#native/list";
import type { DirectoryFilter } from "#types";
import join from "@rcompat/fs/join";
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
