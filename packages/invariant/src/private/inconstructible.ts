import type Instance from "@rcompat/type/Instance";
import constructible from "#constructible";

export default (value: Instance) => !constructible(value);
