import errored from "./errored.js";

export default (predicate, error) => Boolean(predicate) || errored(error);
