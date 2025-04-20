import type UnknownMap from "@rcompat/type/UnknownMap";

export default (map: UnknownMap) => Object.fromEntries(map.entries());
