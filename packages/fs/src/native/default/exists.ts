import stats from "@rcompat/fs/native/stats";
import is from "@rcompat/invariant/is";

export default async (path: string) => {
  is(path).string();

  try {
    await stats(path);
    return true;
  } catch (_) {
    return false;
  }
};
