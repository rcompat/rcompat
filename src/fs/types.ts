export type CollectPattern = string | RegExp;
export type WritableInput = string | Blob;
export type DirectoryFilter = (path: string) => boolean;

export interface DirectoryOptions {
  recursive?: boolean;
};
export interface RemoveOptions extends DirectoryOptions {
  fail?: boolean;
};

export interface RouterNodeConfig {
  specials: Record<PropertyKey, {
    recursive: boolean
  }>;
  predicate: (route: { default: unknown }, request: Request) => boolean;
}

export interface RouterConfig extends RouterNodeConfig {
  directory?: string;
  extension: string;
}

export interface Route {
  default: Record<PropertyKey, unknown>;
}

export interface MatchedRoute {
  path: string;
  file: Route;
  specials: Record<PropertyKey, Function[]>;
  params: Record<PropertyKey, unknown>;
}
