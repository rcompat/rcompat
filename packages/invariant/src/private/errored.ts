import type ErrorFallbackFunction from "#ErrorFallbackFunction";

export default (error?: ErrorFallbackFunction | string) => {
  if (typeof error === "function") {
    // fallback
    error();
  } else {
    // error
    // Todo: Message to throw if 'error' is not defined
    throw new TypeError(error ?? "UNKNOWN ERROR");
  }
};
