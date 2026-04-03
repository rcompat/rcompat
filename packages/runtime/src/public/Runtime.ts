export default interface Runtime {
  name: string;
  bin: string;
  script: string;
  args: string[];
  exit: (code?: number) => never;
  resolve: (specifier: string, from: string) => string;
}
