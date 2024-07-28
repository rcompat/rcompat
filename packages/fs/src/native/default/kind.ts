import Kind from "@rcompat/fs/#/kind";
import exists from "@rcompat/fs/native/exists";
import stats from "@rcompat/fs/native/stats";
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
