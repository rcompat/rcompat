import type { UnknownMap } from "@rcompat/type";

export default (map: UnknownMap) => Object.fromEntries(map.entries());
