import type { MaybePromise } from "@rcompat/type";

type Env<C = void> = {
  globals(context: C): object;
  setup?(): MaybePromise<C>;
  teardown?(context: C): MaybePromise<void>;
};

export type { Env as default };
