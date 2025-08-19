import type Dict from "@rcompat/type/Dict";

export default interface MatchedRoute {
  fullpath: string;
  params: Dict;
  path: string;
  specials: { [s in string]?: string[] };
}
