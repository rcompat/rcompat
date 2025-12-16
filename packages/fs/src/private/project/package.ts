import root from "#project/root";
import assert from "@rcompat/assert";

export default async (from?: string) => {
  assert.maybe.string(from);

  return (await root(from)).join("package.json");
};
