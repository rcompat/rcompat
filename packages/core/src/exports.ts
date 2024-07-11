export interface DebrisTestSuite {
  (test: DebrisTest): void
}

export interface DebrisTest {
  case: (name:string, test: (assert: DebrisTestAssertion) => void) => void;
  reassert: <T extends object>(assert: (args0: DebrisTestAssertion) => T) => void;
}

export interface DebrisTestAssertion {
  (x: unknown): DebrisTestAssertionCombinators
  (x: unknown, y: unknown): DebrisTestAssertionCombinators
}

export interface DebrisTestAssertionCombinators {
  equals: (x: unknown) => void
  throws: (error?: string) => void
  nthrows: () => void
  undefined: () => void
  true: () => void,
  false: () => void
}

export const platform = () => {
  if (typeof Bun !== "undefined") {
    return "bun";
  }
  if (typeof Deno !== "undefined") {
    return "deno";
  }
  return "node";
};

export const NEVER = (value: unknown) => { return value as never };

export class UnimplementedError extends Error {}
