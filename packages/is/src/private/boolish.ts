export default function isBoolish(x: unknown): x is boolean | string {
  return typeof x === "boolean" || x === "true" || x === "false";
}
