import type { Dict, MaybePromise } from "@rcompat/type";

type Env<C = void> = {
  globals(context: C): Dict;
  setup?(): MaybePromise<C>;
  teardown?(context: C): MaybePromise<void>;
};

export type { Env as default };
