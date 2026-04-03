import load from "#load";
import type { Dict } from "@rcompat/type";

const data: Dict<string> = {
  ...process.env as Dict<string>,
  ...await load(),
};

export default {
  get(key: string): string {
    const value = data[key];
    if (value === undefined) {
      throw new Error(`missing environment variable: ${key}`);
    }
    return value;
  },
  try(key: string): string | undefined {
    return data[key];
  },
  toJSON(): Dict<string> {
    return Object.assign(Object.create(null), data);
  },
};
