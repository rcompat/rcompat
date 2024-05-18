import stats from "./stats.js";

export default async path => Math.round((await stats(path)).mtimeMs);
