import text from "./text.js";

export default async (path: string) => JSON.parse(await text(path));
