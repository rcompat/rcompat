import { default as errored, type ErrorFallbackFunction } from "@rcompat/invariant/#/errored";

export default (value: boolean, error?: ErrorFallbackFunction | string): void =>
  { Boolean(value) || errored(error) }
