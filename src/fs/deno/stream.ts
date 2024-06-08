export default async (path: string) => 
  (await Deno.open(path, { write: false })).readable;
