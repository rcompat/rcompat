import candidates from "#candidates";
import parse from "#parse";
import runtime from "@rcompat/runtime";
import type { Dict } from "@rcompat/type";

const ENV = process.env.NODE_ENV ?? process.env.JS_ENV;

export default async function load(): Promise<Dict<string>> {
  const root = await runtime.projectRoot();

  for (const candidate of candidates(ENV)) {
    const file = root.join(candidate);
    if (await file.exists()) {
      return parse(await file.text(), process.env as Dict<string>);
    }
  }

  return {};
};
