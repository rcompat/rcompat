import type NodeConfig from "#router/NodeConfig";

export default interface Config extends NodeConfig {
  import: boolean;
  directory?: string;
  extensions: string[];
}
