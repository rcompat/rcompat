import type Constructor from "@rcompat/type/Constructor";
import constructible from "#constructible";

export default (c: Constructor) => !constructible(c);
