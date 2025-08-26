import type Dict from "@rcompat/type/Dict";

export default interface MatchedRoute {
  params: Dict;
  path: string;
  segment: string;
  specials: { [s in string]?: string[] };
}
