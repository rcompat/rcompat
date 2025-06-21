import type Asserter from "#Asserter";
import type MaybePromise from "@rcompat/type/MaybePromise";

type Body = (asserter: Asserter) => MaybePromise<void>;

export { Body as default };
