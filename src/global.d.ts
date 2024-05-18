
declare global {
  interface DebrisTestSuite {
    (test: DebrisTest): void
  }

  interface DebrisTest {
    case: (name:string, test: (assert: DebrisTestAssertion) => void) => void;
    reassert: <T extends object>(assert: (DebrisTestAssertion) => T) => void;
  }

  interface DebrisTestAssertion {
    (x: unknown): DebrisTestAssertionCombinators
    (x: unknown, y: unknown): DebrisTestAssertionCombinators
  }

  interface DebrisTestAssertionCombinators {
    equals: (x: unknown) => void
    throws: () => void
    nthrows: () => void
    undefined: () => void
  }
}

export {}
