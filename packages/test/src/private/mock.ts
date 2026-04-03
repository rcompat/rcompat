import repository from "#repository";
import is from "@rcompat/is";
import type { Dict } from "@rcompat/type";
import type Module from "node:module";
import module from "node:module";

let loader_registered = false;

const MARK = "std:test/mock";

type AnyFn = (...args: any[]) => any;

type Tracked<F extends AnyFn> = F & {
  calls: Parameters<F>[];
  readonly called: boolean;
};

type MockHandle<T extends object> = {
  [K in keyof T]: T[K] extends AnyFn ? Tracked<T[K]> : T[K];
} & {
  restore(): void;
  [Symbol.dispose](): void;
};

const clean = (specifier: string) => specifier.split("?")[0]!;

const track = <F extends AnyFn>(fn: F): Tracked<F> => {
  const calls: Parameters<F>[] = [];

  const tracked = ((...args: Parameters<F>): ReturnType<F> => {
    calls.push(args);
    return fn(...args);
  }) as Tracked<F>;

  tracked.calls = calls;

  Object.defineProperty(tracked, "called", {
    get: () => calls.length > 0,
  });

  return tracked;
};

const hooks: Module.RegisterHooksOptions = {
  resolve(specifier, context, next) {
    const id = clean(specifier);

    if (!repository.mocks.has(id)) {
      return next(specifier, context);
    }

    const resolved = next(id, context);
    const url = new URL(resolved.url);
    url.searchParams.set(MARK, id);

    return {
      ...resolved,
      shortCircuit: true,
      url: url.href,
    };
  },

  load(url, context, next) {
    const parsed = new URL(url);
    const id = parsed.searchParams.get(MARK);

    if (id === null) {
      return next(url, context);
    }

    const tracked = repository.mocks.get(id) as Dict | undefined;

    if (tracked === undefined) throw new Error(`mock not found for ${id}`);

    const exports = Object.keys(tracked);
    const source = `
      import repository from "@rcompat/test/repository";
      const tracked = repository.mocks.get(${JSON.stringify(id)});
      if (tracked === undefined) {
        throw new Error(${JSON.stringify(`mock not found for ${id}`)});
      }
      ${exports.map(k => `export const ${k} = tracked[${JSON.stringify(k)}];`).join("\n")}
    `;

    return {
      format: "module",
      shortCircuit: true,
      source,
    };
  },
};

export default function mock<T extends object>(
  specifier: string,
  factory: (original: unknown) => T,
): MockHandle<T> {
  if (!loader_registered) {
    module.registerHooks(hooks);
    loader_registered = true;
  }

  const id = clean(specifier);
  const mocked = factory({});

  const tracked: Dict = Object.fromEntries(
    Object.entries(mocked).map(([k, v]) => [
      k,
      is.function(v) ? track(v as AnyFn) : v,
    ]),
  ) as MockHandle<T>;

  repository.mocks.set(id, tracked);

  repository.between(() => {
    for (const v of Object.values(tracked)) {
      if (is.function(v) && "calls" in v) {
        (v.calls as unknown[]).length = 0;
      }
    }
  });

  return Object.assign(tracked, {
    restore() {
      repository.mocks.delete(id);
    },
    [Symbol.dispose]() {
      this.restore();
    },
  }) as MockHandle<T>;
}
