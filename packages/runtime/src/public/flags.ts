import type Runtime from "#Runtime";
import dict from "@rcompat/dict";
import error from "@rcompat/error";
import type { Dict } from "@rcompat/type";

function flag_missing(flag: string) {
  return error.template`flag ${flag} missing`;
}

const errors = error.coded({
  flag_missing,
});

function find(flags: Dict<string>, key: string): string | undefined {
  return Object.hasOwn(flags, key) ? flags[key] : undefined;
}

const flags_bag: (args: string[]) => Runtime["flags"] = args => {
  const entries = args
    .filter(arg => arg.startsWith("--"))
    .map(flag => {
      const [key, ...rest] = flag.split("=");
      return [key, rest.join("=")] as [string, string];
    });

  const flags = Object.fromEntries(entries);

  return dict.new({
    get(key) {
      const value = find(flags, key);
      if (value === undefined) throw errors.flag_missing(key);
      return value;
    },
    try(key) {
      return find(flags, key);
    },
    has(key) {
      return find(flags, key) !== undefined;
    },
    *[Symbol.iterator]() {
      yield* Object.entries(flags) as [string, string][];
    },
    many(key) {
      return entries
        .filter(([k]) => k === key)
        .map(([, v]) => v);
    },
    all() {
      return { ...flags };
    },
    toJSON() {
      return { ...flags };
    },
    toString() {
      return `Flags { ${Object.keys(flags).length} items }`;
    },
  });
};

export default flags_bag;
