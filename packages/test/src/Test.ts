import { FlatFile, resolve } from "@rcompat/fs";
import { yellow } from "@rcompat/colors";
import Case from "./Case.js";
import type Assert from "./Assert.js";

export type CaseBody = (assert: TestAssertion) => void;

export interface TestAssertion {
  (x: unknown): Assert 
  (x: unknown, y: unknown): Assert 
}

const reduce = (array: any, initial: any) =>
  array.reduce(async (previous: any, current: any) =>
    current(previous), initial);

export default class Test {
  #reasserts: any[] = [];
  #fixes: any[] = [];
  #lifecycle = Object.fromEntries(["setup", "before", "after", "teardown"]
    .map(operation => [operation, async () => null]));
  id: number;
  cases: Case[] = [];
  path: string;
  name: string;

  constructor(root: FlatFile, spec: FlatFile, id: number) {
    this.path = spec.path;
    this.name = this.path.replace(`${root}/`, () => "");
    this.id = id;
  }

  async per(preassert: (actual: any) => any, prefixtures: any[], c: Case) {
    const assert = await reduce(this.#reasserts, preassert);
    const fixtures = Object.fromEntries(prefixtures.map(([key, value]) =>
      [key, value()]));
    await c.body(assert, await reduce(this.#fixes, fixtures));
  }

  fix(mapper: () => any) {
    this.#fixes.push(mapper);
    return this;
  }

  reassert(mapper: () => any) {
    this.#reasserts.push(mapper);
    return this;
  }

  case(description: string, body: CaseBody) {
    this.cases.push(new Case(description, body, this));
  }

  lifecycle(lifecycle = {}) {
    this.#lifecycle = {...this.#lifecycle, ...lifecycle};
  }

  setup(setup = () => null) {
    this.lifecycle({setup});
  }

  before(before = () => null) {
    this.lifecycle({before});
  }

  after(after = () => null) {
    this.lifecycle({after});
  }

  teardown(teardown = () => null) {
    this.lifecycle({teardown});
  }

  async run(target: string | undefined, fixtures: any[]) {
    const spec = await import(this.path);
    if (spec.default === undefined) {
      const path = this.path.replace(`${resolve()}/`, "");
      console.log(`${yellow("??")} ${path} doesn't export a default function`);
      return this;
    }
    spec.default(this);

    const {setup, before, after, teardown} = this.#lifecycle;
    await setup();
    for (const c_ of this.cases) {
      await before();
      await c_.run(target, fixtures);
      await after();
    }
    await teardown();
    return this;
  }
}
