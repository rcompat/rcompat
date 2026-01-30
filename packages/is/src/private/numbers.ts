function isFinite(x: unknown): x is bigint | number {
  if (typeof x === "bigint") return true;
  if (typeof x === "number") return Number.isFinite(x);
  return false;
}

function isInt(x: unknown): x is bigint | number {
  if (typeof x === "number") return Number.isInteger(x);
  if (typeof x === "bigint") return true;
  return false;
}

function isNaN(x: unknown): x is number {
  return typeof x === "number" && Number.isNaN(x);
}

function isSafeInt(x: unknown): x is number {
  if (typeof x === "number") return Number.isSafeInteger(x);
  return false;
}

function isUint(x: unknown): x is bigint | number {
  if (typeof x === "bigint") return x >= 0n;
  if (typeof x === "number") return Number.isInteger(x) && x >= 0;
  return false;
}

export default {
  isFinite,
  isInt,
  isNaN,
  isSafeInt,
  isUint,
};
