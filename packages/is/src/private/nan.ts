export default function isNaNValue(x: unknown): x is number {
  return typeof x === "number" && Number.isNaN(x);
}
