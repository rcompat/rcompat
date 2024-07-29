import stats from "./stats.js";

export default async (path: string) => Math.round((await stats(path)).mtimeMs);
