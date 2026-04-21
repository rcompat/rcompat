import is from "@rcompat/is";
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
      monorepo: is.boolean(input.monorepo) ? input.monorepo : defaults.monorepo,
      packages: is.string(input.packages) ? input.packages : defaults.packages,
      include: is.array(input.include) && input.include.every(is.string)
        ? input.include
        : defaults.include,
    };
  },
};
