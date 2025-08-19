import type Dict from "@rcompat/type/Dict";

export default interface NodeConfig {
  specials: Dict<{
    recursive: boolean;
  }>;
}
