export default interface NodeConfig {
  specials: Record<PropertyKey, {
    recursive: boolean
  }> | undefined;
  predicate: (route: { default: unknown }, request: Request) =>
    boolean | undefined;
}
