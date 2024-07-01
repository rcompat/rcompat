import errored, { ErrorFallbackFunction } from "./errored.js";

export default (value: boolean, error?: ErrorFallbackFunction | string): void => { Boolean(value) || errored(error) }
