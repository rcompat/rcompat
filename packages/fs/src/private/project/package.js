import root from "#root";
import maybe from "@rcompat/assert/maybe";

export default async (from?: string) => {
  maybe(from).string();

  return (await root(from)).join("package.json");
};
