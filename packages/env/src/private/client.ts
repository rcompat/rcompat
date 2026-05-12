export default {
  get(_key: string): string {
    throw new Error();
  },
  try(_key: string) {
    return undefined;
  },
  toJSON(): Dict<string> {
    return Object.assign(Object.create(null), {});
  },
};
