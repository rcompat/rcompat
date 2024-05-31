import { tryreturn } from "rcompat/async";

const MODULE_NOT_FOUND = "ERR_MODULE_NOT_FOUND";

export class MetaDependError extends Error {
  names: string[];
  versions: string[];

  constructor(message: string, names: string[], versions: string[], options?: ErrorOptions) {
    super(message, options)
    this.name = 'MetaDependError';
    this.names = names;
    this.versions = versions;
  }
}

export default async (dependencies: any): Promise<unknown[]> => {
  const modules = Object.keys(dependencies);

  const results = await Promise.all(modules.map(module =>
    tryreturn<unknown>(() => import(module))
      .orelse<unknown>(async (error) => (error as { code: string }).code === MODULE_NOT_FOUND ? module : {})));

  const errored = results.filter((result): result is string => typeof result === "string");
  const versions = Object.entries(dependencies)
    .filter(([dependency]) => errored.includes(dependency))
    .map(([key, value]) => `${key}@${value}`);
  if (errored.length > 0) {
    throw new MetaDependError('', errored, versions);
  }
  return results.filter(result => typeof result !== "string");
};

