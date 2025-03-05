import FileRef from "#FileRef";
import parse from "#parse";
import maybe from "@rcompat/invariant/maybe";
import { resolve } from "node:path";

export default (path?: string): FileRef => {
  maybe(path).string();

  return new FileRef(path === undefined ? resolve() : resolve(parse(path)));
}
