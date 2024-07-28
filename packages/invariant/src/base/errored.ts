export type ErrorFallbackFunction = () => void;

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
