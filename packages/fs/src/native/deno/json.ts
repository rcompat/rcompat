import { text } from "@rcompat/fs/native";

export default async (path: string): Promise<unknown> => JSON.parse(await text(path));
