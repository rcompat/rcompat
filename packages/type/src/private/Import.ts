import type Dictionary from "#Dictionary";

type Import = Dictionary & {
  default?: unknown;
};

export type { Import as default };
