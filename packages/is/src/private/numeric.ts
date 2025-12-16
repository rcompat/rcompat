const DECIMAL = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;

export default function isNumeric(x: unknown): x is string {
  if (typeof x !== "string") return false;

  const trimmed = x.trim();

  if (trimmed === "") return false;

  return DECIMAL.test(trimmed);
}
