import type Dict from "@rcompat/type/Dict";

interface Options {
  frozen?: boolean;
}

function hasDepth(o: object): boolean {
  const keys = [
    ...Object.getOwnPropertyNames(o),
    ...Object.getOwnPropertySymbols(o) as (string | symbol)[],
  ];

  for (const key of keys) {
    const descriptor = Object.getOwnPropertyDescriptor(o, key);
    // skip accessors
    if (descriptor === undefined || !("value" in descriptor)) continue;

    const value = descriptor.value;
    if (value !== null && typeof value === "object") {
      // Any object counts as depth > 1
      return true;
    }
  }
  return false;
}

export default function nullproto(): Dict<never>;
export default function nullproto<T extends object>(
  init: T,
  options: { frozen: true },
): Readonly<T>;
export default function nullproto<T extends object>(init: T): T;
export default function nullproto<T extends object>(
  init?: T,
  options?: Options,
) {
  const hasInit = init !== undefined;

  if (options?.frozen && hasInit && hasDepth(init)) {
    throw new TypeError(
      "nullproto: cannot freeze a non-flat object",
    );
  }

  const o: T = Object.create(null);

  hasInit && Object.defineProperties(o, Object.getOwnPropertyDescriptors(init));

  return options?.frozen ? Object.freeze(o) : o;
}
