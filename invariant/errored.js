export default error => {
  if (typeof error === "function") {
    // fallback
    error();
  } else {
    // error
    throw new TypeError(error);
  }
};
