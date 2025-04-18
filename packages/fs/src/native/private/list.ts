import FileRef from "#FileRef";
import type { DirectoryFilter } from "#types";
import join from "@rcompat/fs/join";
import maybe from "@rcompat/invariant/maybe";
import Dictionary from "@rcompat/record/Dictionary";
import { readdir } from "node:fs/promises";

type List = (path: string, filter?: DirectoryFilter, Options?: Dictionary)
  => Promise<FileRef[]>;

const list: List = async (path, filter = () => true, options) => {
  maybe(filter).function();
  maybe(options).object();

  const paths = await readdir(path, options);

  return paths.filter(filter).map(subpath => join(path, subpath));
};

export default list;
