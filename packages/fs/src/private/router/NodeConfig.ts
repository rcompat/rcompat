export default interface NodeConfig {
  specials: Record<PropertyKey, {
    recursive: boolean;
  }>;
  predicate: (route: { default: unknown }, request: Request) => boolean;
}
