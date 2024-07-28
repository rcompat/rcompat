import is from "@rcompat/invariant/is";
import stats from "./stats.js";

export default async (path: string) => {
  is(path).string();

  try {
    await stats(path);
    return true;
  } catch (_) {
    return false;
  }
};
