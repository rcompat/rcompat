export default async (path: string) => 
  (await Deno.open(path, { read: true })).readable;
