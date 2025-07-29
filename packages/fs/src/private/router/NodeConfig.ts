export default interface NodeConfig {
  specials: Record<PropertyKey, {
    recursive: boolean;
  }>;
}
