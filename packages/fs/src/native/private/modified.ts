import { stats } from "@rcompat/fs/native/#";

export default async (path: string) => Math.round((await stats(path)).mtimeMs);
