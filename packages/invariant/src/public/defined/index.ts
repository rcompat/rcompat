import type { ErrorFallbackFunction } from "#errored";
import is from "@rcompat/invariant/is";

export default (value: unknown, error?: ErrorFallbackFunction) =>
  is(value).defined(error);
