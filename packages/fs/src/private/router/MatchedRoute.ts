export default interface MatchedRoute {
  fullpath: string;
  params: Record<PropertyKey, unknown>;
  path: string;
  specials: { [s in string]?: string[] };
}
