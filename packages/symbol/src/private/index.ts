const parse: unique symbol = Symbol.for("std:symbol/parse");
const stream: unique symbol = Symbol.for("std:symbol/stream");

const symbol = {
  parse,
  stream,
} as const;

export default symbol;
