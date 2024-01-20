import { maybe } from "rcompat/invariant";
import list from "./list.js";
import Kind from "../Kind.js";

const collect = async (path, pattern, options) => {
  let files;
  try {
    files = await list(path);
  } catch (_) {
    files = [];
  }

  let paths = [];
  for (const file of files) {
    if (file.name.startsWith(".")) {
      continue;
    }
    if (options?.recursive && await file.kind() === Kind.Directory) {
      paths = paths.concat(await file.collect(pattern, options));
    } else if (pattern === undefined ||
        new RegExp(pattern, "u").test(file.path)) {
      paths.push(file);
    }
  }
  return paths;
};

export default (path, pattern, options) => {
  maybe(pattern).anyOf(["string", RegExp]);
  maybe(options).object();

  return collect(path, pattern, {
    ...options,
    recursive: options?.recursive ?? true,
  });
};
