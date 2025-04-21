import type Import from "#router/Import";

export default interface MatchedRoute<Route extends Import, Special extends Import> {
  path: string;
  file: Route;
  specials: {[s in string]?: Special[]},
  params: Record<PropertyKey, unknown>;
}
