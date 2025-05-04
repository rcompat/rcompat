import type Import from "#router/Import";
import type Node from "#router/Node";

type NodePredicate<Route extends Import, Special extends Import> =
  (node: Node<Route, Special>) => boolean;

export type { NodePredicate as default };
