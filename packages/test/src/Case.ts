import Assert from "./Assert.js";
import type Test from "./Test.js";

export default class Case {
  description: string;
  body: Function;
  test: Test;
  id: number;
  asserts: any[] = [];
  disabled: boolean = false;

  constructor(description: string, body: Function, test: Test) {
    this.description = description;
    this.body = body;
    this.test = test;
    this.id = test.cases.length;
  }

  get number() {
    return `${this.test.id}.${this.id}`;
  }

  get name() {
    return `${this.number} ${this.test.name}`;
  }

  report(passed: any, actual: any, expected: any) {
    this.asserts.push(passed, actual, expected);
  }

  get passed() {
    // not one assert which did not pass
    return !this.asserts.some(assert => !assert.passed);
  }

  targeted(target: string) {
    return target.includes(".")
      ? target === this.number
      : Number(target) === this.test.id;
  }

  async run(target: string | undefined, fixtures: any[]) {
    if (target !== undefined && !this.targeted(target)) {
      this.disabled = true;
      return;
    }
    try {
      const assert = (actual: any) => {
        const assert = new Assert(actual, this.asserts.length, this);
        this.asserts.push(assert);
        return assert;
      };
      assert.fail = () => assert(true).false();
      await this.test.per(assert, fixtures, this);
    } catch (error) {
      console.log(error);
    }
  }
}
