export default function isInteger(x: unknown): x is number | bigint {
  if (typeof x === "bigint") {
    return true;
  }

  if (typeof x === "number") {
    return Number.isInteger(x);
  }

  return false;
}
