import type { Dict } from "@rcompat/type";

export type Config = {
  monorepo: boolean;
  packages: string;
  include: string[];
};

const defaults: Config = {
  monorepo: false,
  packages: "packages",
  include: ["src", "test"],
};

export default {
  parse(input: Dict = {}): Config {
    return {
      monorepo: typeof input.monorepo === "boolean" ? input.monorepo : defaults.monorepo,
      packages: typeof input.packages === "string" ? input.packages : defaults.packages,
      include: Array.isArray(input.include) && input.include.every((x: unknown) =>
        typeof x === "string")
        ? input.include
        : defaults.include,
    };
  },
};
