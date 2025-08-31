type IsEqual<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2)
  ? ((<T>() => T extends B ? 1 : 2) extends
    (<T>() => T extends A ? 1 : 2) ? true : false)
  : false;

export type { IsEqual as default };
