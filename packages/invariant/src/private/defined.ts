import type ErrorFallbackFunction from "#ErrorFallbackFunction";
import is from "@rcompat/invariant/is";

export default (value: unknown, error?: ErrorFallbackFunction) =>
  is(value).defined(error);
