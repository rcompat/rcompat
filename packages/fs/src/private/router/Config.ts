import type NodeConfig from "#router/NodeConfig";

type Config = NodeConfig & {
  directory?: string;
  extensions: string[];
};

export type { Config as default };;
