import type ErrorFallbackFunction from "#ErrorFallbackFunction";
import Is from "#Is";

export default (value: unknown, error?: ErrorFallbackFunction) =>
  new Is(value).defined(error);
