import type { Proper } from "@rcompat/object/types";

export default (object: unknown): object is Proper =>
  typeof object === "object" && object !== null;
