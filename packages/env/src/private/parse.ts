const COMMENT = /^\s*#/;
const BLANK = /^\s*$/;
const EXPORT = /^\s*export\s+/;
const KEY_VALUE = /^\s*([\w.]+)\s*=\s*(.*?)\s*$/;
const QUOTED_SINGLE = /^'([^']*)'$/;
const QUOTED_DOUBLE = /^"([^"]*)"$/;

import type { Dict } from "@rcompat/type";

function unquote(value: string): [string, boolean] {
  const single = QUOTED_SINGLE.exec(value);
  if (single !== null) return [single[1], false];
  const double = QUOTED_DOUBLE.exec(value);
  if (double !== null) return [double[1], true];
  return [value, true];
};

function substitute(value: string, env: Dict<string>): string {
  return value
    .replace(/\\\$/g, "\uE000")
    .replace(/\$\{(\w+)(?::-(.[^}]*))?\}|\$(\w+)/g, (_, braced, fallback, bare) =>
      env[braced ?? bare] ?? fallback ?? "")
    .replace(/\uE000/g, "$");
}

export default function(raw: string, env: Dict<string> = {}): Dict<string> {
  const result: Dict<string> = {};

  for (const line of raw.split("\n")) {
    if (COMMENT.test(line) || BLANK.test(line)) continue;

    const stripped = line.replace(EXPORT, "");
    const match = KEY_VALUE.exec(stripped);
    if (match === null) continue;

    const [, key, raw_value] = match;
    const [unquoted, should_substitute] = unquote(raw_value);
    const value = should_substitute
      ? substitute(unquoted, { ...env, ...result })
      : unquoted;

    result[key] = value;
  }

  return result;
};
