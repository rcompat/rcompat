import list from "./list.js";
import Kind from "../Kind.js";

export default async (base: string, pattern: string) => {
  let paths = await list(base, name => !name.startsWith("."));
  for (const file of paths) {
    if (await file.kind() === Kind.Directory) {
      paths = paths.concat(await file.glob(pattern));
    } else if (new RegExp(pattern, "u").test(file.path)) {
      paths.push(file);
    }
  }
  return paths;
};
