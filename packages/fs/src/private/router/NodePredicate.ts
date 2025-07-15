import type Node from "#router/Node";
import type Import from "@rcompat/type/Import";

type NodePredicate<Route extends Import, Special extends Import> =
  (node: Node<Route, Special>) => boolean;

export type { NodePredicate as default };
