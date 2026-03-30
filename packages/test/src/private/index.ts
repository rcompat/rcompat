import type Asserter from "#Asserter";
import type Body from "#Body";
import type End from "#End";
import type Env from "#Env";
import type Result from "#Result";
import type Test from "#Test";
import type { ExtendedTest, Factory } from "#extend";
import extend from "#extend";
import repository from "#repository";

const base = {
  case(name: string, body: Body) {
    repository.put(name, body);
  },
  ended(end: End) {
    repository.ended(end);
  },
};

export default {
  ...base,
  extend<Subject, Extensions>(factory: Factory<Subject, Extensions>):
    ExtendedTest<Extensions> {
    return extend(base, factory);
  },
};

export type { Asserter, Env, ExtendedTest, Result, Test };
