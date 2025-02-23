import Dictionary from "@rcompat/record/Dictionary";

export interface RouterNodeConfig {
  specials?: Record<PropertyKey, {
    recursive: boolean
  }>;
  predicate?: (route: { default: unknown }, request: Request) => boolean;
}

export interface RouterConfig extends RouterNodeConfig {
  import: boolean,
  directory?: string;
  extensions: [string];
}

export interface MatchedRoute<Route extends Import> {
  path: string;
  file: Route;
  specials: Record<PropertyKey, Function[]>;
  params: Record<PropertyKey, unknown>;
}

export type Import = Dictionary & { default: unknown };
