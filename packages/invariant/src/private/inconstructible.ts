import type Constructible from "@rcompat/type/Constructible";
import constructible from "#constructible";

export default (value: Constructible) => !constructible(value);
