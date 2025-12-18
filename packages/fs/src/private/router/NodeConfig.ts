import type { Dict } from "@rcompat/type";

export default interface NodeConfig {
  specials: Dict<{
    recursive: boolean;
  }>;
}
