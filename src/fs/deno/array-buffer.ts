export default async (path: string) => (await Deno.readFile(path));
