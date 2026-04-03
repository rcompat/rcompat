import test from "@rcompat/test";

test.mock("#fixtures/static-mock/math", () => ({
  add: (a: number, b: number) => 99,
}));
