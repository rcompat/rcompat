import execute from "#execute";

const is_win = process.platform === "win32";
const which = is_win ? "where" : "which";
const qualify = (path: string) => is_win ? `"${path}"` : path;

export default async (command: string) =>
  qualify(await execute(`${which} ${command}`, {})).replaceAll("\n", "");
