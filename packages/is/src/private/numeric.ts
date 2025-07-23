export default function isNumeric(x: string | number | bigint) {
  if (typeof x === "bigint") {
    return true;
  }

  if (typeof x === "number") {
    return Number.isFinite(x);
  }

  if (typeof x === "string") {
    return x.trim() !== "" && Number.isFinite(Number(x));
  }
  return false;
}
