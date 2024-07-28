import text from "@rcompat/fs/native/text";

export default async (path: string): Promise<unknown> =>
  JSON.parse(await text(path));
