import { AnyConstructibleFunction } from "./types.js";

export const constructible = (value: unknown): boolean => {
  try {
    // Todo: Clean type?
    Reflect.construct(String, [], value as AnyConstructibleFunction);
    return true;
  } catch (error) {
    return false;
  }
};

export const inconstructible = (value: AnyConstructibleFunction) => !constructible(value);

export const inconstructible_function =
  (value: AnyConstructibleFunction): boolean => inconstructible(value) && typeof value === "function";
