import stats from "./stats.js";

export default async path => {
  try {
    await stats(path);
    return true;
  } catch (_) {
    return false;
  }
};
