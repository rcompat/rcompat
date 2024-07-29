import { default as errored, type ErrorFallbackFunction } from "#errored";

export default (value: boolean, error?: ErrorFallbackFunction | string): void =>
  { Boolean(value) || errored(error) }
