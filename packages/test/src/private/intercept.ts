type Handler = (request: Request) => unknown;

type Route = {
  method: string;
  path: string;
  handler: Handler;
};

type Setup = {
  get(path: string, handler: Handler): void;
  post(path: string, handler: Handler): void;
  put(path: string, handler: Handler): void;
  patch(path: string, handler: Handler): void;
  delete(path: string, handler: Handler): void;
};

type Intercept = {
  calls(path: string): number;
  requests(path: string): Request[];
  restore(): void;
  [Symbol.asyncDispose](): Promise<void>;
};

export default (base_url: string, setup: (setup: Setup) => void): Intercept => {
  const routes: Route[] = [];
  const log: Request[] = [];
  const original = globalThis.fetch;

  const register = (method: string) => (path: string, handler: Handler) => {
    routes.push({ method, path, handler });
  };

  setup({
    get: register("GET"),
    post: register("POST"),
    put: register("PUT"),
    patch: register("PATCH"),
    delete: register("DELETE"),
  });

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = new Request(input, init);
    const url = new URL(request.url);
    const origin = url.origin;
    const path = url.pathname;

    if (origin !== base_url) {
      return original(request);
    }

    const route = routes.find(r =>
      r.method === request.method && r.path === path,
    );

    if (route === undefined) {
      throw new Error(`no intercept registered for ${request.method} ${url.href}`);
    }

    log.push(request);

    const body = route.handler(request);
    return Response.json(body);
  }) as typeof globalThis.fetch;

  const restore = () => {
    globalThis.fetch = original;
  };

  return {
    calls(path) {
      return log.filter(r => new URL(r.url).pathname === path).length;
    },
    requests(path) {
      return log.filter(r => new URL(r.url).pathname === path);
    },
    restore,
    async [Symbol.asyncDispose]() {
      restore();
    },
  };
};
