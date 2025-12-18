import type { Dict } from "@rcompat/type";

export default interface MatchedRoute {
  params: Dict;
  path: string;
  segment: string;
  specials: { [s in string]?: string[] };
}
