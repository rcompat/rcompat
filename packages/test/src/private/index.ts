import type Body from "#Body";
import type End from "#End";
import repository from "#repository";

export default {
  case(name: string, body: Body) {
    repository.put(name, body);
  },
  ended(end: End) {
    repository.ended(end);
  },
};

export type { default as Asserter } from "#Asserter";
export type { default as Env } from "#Env";
export type { default as Result } from "#Result";
export type { default as Test } from "#Test";

