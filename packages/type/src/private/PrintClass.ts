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
                                // 1-dimension generics
                                  T extends Set<infer E>? `Set<${Print<E>}>` :
                                    T extends WeakSet<infer E>? `WeakSet<${Print<E>}>` :
                                      T extends Promise<infer E> ? `Promise<${Print<E>}>` :
                                      // 2-dimension generics
                                        T extends Map<infer K, infer V>? `Map<${Print<K>}, ${Print<V>}>` :
                                          T extends WeakMap<infer K, infer V>? `WeakMap<${Print<K>}, ${Print<V>}>` :
                                          // indexed arrays
                                            T extends Int8Array ? "Int8Array" :
                                              T extends Uint8Array ? "Uint8Array" :
                                                T extends Uint8ClampedArray ? "Uint8ClampedArray" :
                                                  T extends Int16Array ? "Int16Array" :
                                                    T extends Uint16Array ? "Uint16Array" :
                                                      T extends Int32Array ? "Int32Array" :
                                                        T extends Uint32Array ? "Uint32Array" :
                                                          T extends BigInt64Array ? "BigInt64Array" :
                                                            T extends BigUint64Array ? "BigUint64Array" :
                                                              T extends Float16Array ? "Float16Array" :
                                                                T extends Float32Array ? "Float32Array" :
                                                                  T extends Float64Array ? "Float64Array" :
                                                                    "Object";

export type { PrintClass as default };
