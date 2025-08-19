import isPrimitive from "#primitive";
import test from "@rcompat/test";

test.case("valid", (assert) => {
  const values = [
    "0",
    0,
    1,
    false,
    true,
    0n,
    1n,
    Symbol("sym"),
    undefined,
    null,
  ];
  for (const s of values) assert(isPrimitive(s)).true();
});

test.case("invalid", (assert) => {
  const values = [
    {},
    [],
    new Set(),
    new Map(),
    new Date(),
    new URL("https://primate.run"),
    new Blob(),
    new File(["test"], "file.name"),
  ];
  for (const s of values) assert(isPrimitive(s)).false();
});
