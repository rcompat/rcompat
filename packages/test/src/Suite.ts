import type Test from "./Test.js";

export default interface Suite {
  (test: Test): void
}
