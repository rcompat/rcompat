import type { Boolish } from "@rcompat/type";

function isBlank(x: unknown): x is string {
  return typeof x === "string" && /^\s*$/.test(x);
}

function isBoolish(x: unknown): x is Boolish {
  return x === "true" || x === "false";
}

export default {
  isBlank,
  isBoolish,
};
