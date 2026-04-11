import type { Dict } from "@rcompat/type";

type NodeConfig = {
  specials: Dict<{
    recursive: boolean;
  }>;
};

export type { NodeConfig as default };
