import type { UnknownMap } from "#types/map";

export default (map: UnknownMap) => Object.fromEntries(map.entries());
