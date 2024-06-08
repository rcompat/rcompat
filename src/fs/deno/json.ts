import text from "./text.js";

export default async (path: string): Promise<unknown> => JSON.parse(await text(path));
