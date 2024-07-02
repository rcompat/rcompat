import type Case from "./Case.js";
import type Test from "./Test.js";

export interface Desc {
  name: string,
  description: string
  asserts?: any[] 
}

export default class Reporter {
  #explicit;
  asserts: string = "";

  constructor(explicit: boolean) {
    this.#explicit = explicit;
  }

  report(tests: Test[]) {
    tests.forEach(test =>
      test.cases.filter(c => !c.disabled).forEach(c => this.case(c)));
  }

  case(c: Case) {
    const {length} = c.asserts;
    this.asserts = length > 1 ? `[0-${length - 1}]` : "";
    if (length === 0) {
      this.empty(c);
    } else {
      this.nonempty(c);
    }
  }

  empty({ name, description }: Desc) {
    console.log(`${name} \x1b[33m${description}\x1b[0m ${this.asserts}`);
  }

  nonempty(c: Case) {
    if (c.passed) {
      this.passed(c);
    } else {
      this.failed(c);
    }
  }

  passed({ name, description }: Desc) {
    if (this.#explicit) {
      console.log(`${name} \x1b[32m${description}\x1b[0m ${this.asserts}`);
    }
  }

  failed({ name, description, asserts = [] }: Desc) {
    console.log(`${name} \x1b[31m${description}\x1b[0m ${this.asserts}`);
    for (const assert of asserts) {
      if (!assert.passed) {
        const {id, expected, actual} = assert;
        console.log(` \x1b[31m[${id}]\x1b[0m`);
        console.log(` expected ${JSON.stringify(expected)}`);
        console.log(` actual   \x1b[31m${JSON.stringify(actual)}\x1b[0m`);
      }
    }
  }
}
