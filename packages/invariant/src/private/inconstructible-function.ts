import type Constructible from "@rcompat/type/Constructible";
import inconstructible from "#inconstructible";

export default (value: Constructible): boolean =>
  inconstructible(value) && typeof value === "function";
