import type { Boolish } from "@rcompat/type";

function isBlank(x: unknown): x is string {
  return typeof x === "string" && /^\s*$/.test(x);
}

function isBoolish(x: unknown): x is Boolish {
  return x === "true" || x === "false";
}

function isText(x: unknown): x is string {
  return typeof x === "string" && x.length > 0;
}

export default {
  isBlank,
  isBoolish,
  isText,
};
