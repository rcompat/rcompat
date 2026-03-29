import CodeError from "#CodeError";
import type TemplateError from "#TemplateError";
import type { Dict } from "@rcompat/type";

type ErrorFunction = (...args: any[]) => TemplateError;

export default function coded<T extends Dict<ErrorFunction>>(fns: T): T {
  return Object.fromEntries(
    Object.entries(fns).map(([key, fn]) => [
      key,
      (...args: any[]) => {
        const err = fn(...args);
        return new CodeError(key, err.strings, ...err.params);
      },
    ]),
  ) as unknown as T;
}
