import type { Dict } from "@rcompat/type";

type TypeName =
  | "bigint"
  | "boolean"
  | "function"
  | "number"
  | "string"
  | "symbol"
  | "object"
  ;

type ShapeDescriptor = Dict<`${TypeName}${"?" | ""}`>;

export type { ShapeDescriptor as default };
