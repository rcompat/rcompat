import type NodeConfig from "#router/NodeConfig";

export default interface Config extends NodeConfig {
  directory?: string;
  extensions: string[];
}
