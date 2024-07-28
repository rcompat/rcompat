import is from "@rcompat/invariant/is";
import type { ErrorFallbackFunction } from "@rcompat/invariant/base/errored";

const defined = (value: unknown, error?: ErrorFallbackFunction) => is(value).defined(error);
