export default (error?: Error | string) => {
  if (error instanceof Error) {
    throw error;
  } else {
    throw new TypeError(error ?? "UNKNOWN ERROR");
  }
};
