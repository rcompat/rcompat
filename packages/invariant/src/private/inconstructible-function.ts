import type ConstructibleFunction from "@rcompat/type/ConstructibleFunction";
import inconstructible from "#inconstructible";

export default (value: ConstructibleFunction): boolean =>
  inconstructible(value) && typeof value === "function";
