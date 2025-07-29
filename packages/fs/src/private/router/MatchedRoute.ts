export default interface MatchedRoute {
  path: string;
  fullpath: string;
  specials: { [s in string]?: string[] };
  params: Record<PropertyKey, unknown>;
}
