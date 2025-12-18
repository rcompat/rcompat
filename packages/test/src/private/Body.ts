import type Asserter from "#Asserter";
import type { MaybePromise } from "@rcompat/type";

type Body = (asserter: Asserter) => MaybePromise<void>;

export { Body as default };
