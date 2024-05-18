
declare global {
  interface DebrisTestSuite {
    (test: DebrisTest): void
  }

  interface DebrisTest {
    case: (name:string, test: (assert: DebrisTestAssertion) => void) => void;
    reassert: (assert: (DebrisTestAssertion) => void) => void;
  }

  interface DebrisTestAssertion {
    (x: unknown): DebrisTestAssertionCombinators
    (x: unknown, y: unknown): DebrisTestAssertionCombinators
  }

  interface DebrisTestAssertionCombinators {
    equals: (x: unknown) => void
  }
}

export {}
