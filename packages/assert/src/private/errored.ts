import type MaybeError from "#MaybeError";

export default (error?: MaybeError) => {
  if (error instanceof Error) {
    throw error;
  } else {
    throw new TypeError(error ?? "UNKNOWN ERROR");
  }
};
