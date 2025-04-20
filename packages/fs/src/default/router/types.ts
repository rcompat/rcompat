import type Dictionary from "@rcompat/record/Dictionary";

export interface RouterNodeConfig {
  specials: Record<PropertyKey, {
    recursive: boolean
  }> | undefined;
  predicate: (route: { default: unknown }, request: Request) => boolean | undefined;
}

export interface RouterConfig extends RouterNodeConfig {
  import: boolean,
  directory: string | undefined;
  extensions: [string];
}

export interface MatchedRoute<Route extends Import, Special extends Import> {
  path: string;
  file: Route;
  specials: {[s in string]?: Special[]},
  params: Record<PropertyKey, unknown>;
}

export type Import = Dictionary & { default: unknown };
