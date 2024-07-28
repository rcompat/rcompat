import is from "@rcompat/invariant/is";
import type { ErrorFallbackFunction } from "@rcompat/invariant/#/errored";

export default (value: unknown, error?: ErrorFallbackFunction) => is(value).defined(error);
