import type Instance from "@rcompat/type/Instance";
import inconstructible from "#inconstructible";

export default (value: Instance): boolean =>
  inconstructible(value) && typeof value === "function";
