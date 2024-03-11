import { copyFile, realpath } from "node:fs/promises";
import list from "./list.js";
import kind from "./kind.js";
import File from "../File.js";
import Kind from "../Kind.js";
import { is } from "rcompat/invariant";

export default async (path, to, filter = () => true) => {
  is(filter).function();

  const $kind = await kind(path);

  if ($kind === Kind.Link) {
    return new File(await realpath(path)).copy(to, filter);
  }

  if ($kind === Kind.Directory) {
    // recreate directory if necessary
    await to.remove();
    await to.create();
    // copy all files
    return Promise.all((await list(path, filter))
      .map(({ name }) => File.join(path, name).copy(to.join(name))));
  }

  return copyFile(path, to.path);
};
