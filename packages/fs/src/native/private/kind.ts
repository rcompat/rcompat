import Kind from "@rcompat/fs/#/kind";
import { exists, stats } from "@rcompat/fs/native/#";
import is from "@rcompat/invariant/is";

export default async (path: string) => {
  is(path).string();
  is(await exists(path)).true();

  const $stats = await stats(path);

  if ($stats.isFile()) {
    return Kind.File;
  }

  if ($stats.isDirectory()) {
    return Kind.Directory;
  }

  return Kind.Link;
};
