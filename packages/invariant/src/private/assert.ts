import errored from "#errored";
import type ErrorFallbackFunction from "#ErrorFallbackFunction";

export default (value: boolean, error?: ErrorFallbackFunction | string) => {
  Boolean(value) || errored(error);
};
