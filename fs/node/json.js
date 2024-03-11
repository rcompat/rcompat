import text from "./text.js";

export default async path => JSON.parse(await text(path));
