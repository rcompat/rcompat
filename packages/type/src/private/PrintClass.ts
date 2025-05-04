/* eslint @typescript-eslint/no-wrapper-object-types: "off" */
/* eslint @typescript-eslint/no-unsafe-function-type: "off" */
import type Print from "#Print";

type PrintClass<T> =
  T extends { Name: infer N extends string }
    ? T extends { Type: infer P }
      ? `${N}<${Print<P>}>` : `${N}` :
  T extends String ? "String" :
  T extends Boolean ? "Boolean" :
  T extends BigInt ? "BigInt" :
  T extends Number ? "Number" :
  T extends Symbol ? "Symbol" :
  T extends RegExp ? "RegExp" :
  T extends Error ? "Error" :
  T extends Function ? "Function" :
  T extends FormData ? "FormData" :
  T extends Date ? "Date" :
  T extends URL ? "URL" :
  // needs to come before Blob, as File is a Blob
  T extends File ? "File" :
  T extends Blob ? "Blob" :
  T extends ReadableStream ? "ReadableStream" :
  T extends WritableStream ? "WritableStream" :
  T extends Promise<infer E> ? `Promise<${Print<E>}>` :
  "Object";

export type { PrintClass as default };
