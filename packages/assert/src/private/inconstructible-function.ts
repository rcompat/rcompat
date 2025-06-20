import constructible from "#constructible";
import type Constructor from "@rcompat/type/Constructor";

export default (c: Constructor) => !constructible(c) && typeof c === "function";
