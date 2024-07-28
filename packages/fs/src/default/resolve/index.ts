import FileRef from "@rcompat/fs/#/file-ref";
import parse from "@rcompat/fs/#/parse";
import maybe from "@rcompat/invariant/maybe";
import { resolve } from "node:path";

export default (path?: string): FileRef => {
  maybe(path).string();

  return FileRef.new(path === undefined ? resolve() : resolve(parse(path)));
}
