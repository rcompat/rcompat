import type ConstructibleFunction from "@rcompat/type/ConstructibleFunction";
import constructible from "#constructible";

export default (value: ConstructibleFunction) => !constructible(value);
