import stats from "@rcompat/fs/native/stats";

export default async (path: string) => Math.round((await stats(path)).mtimeMs);
