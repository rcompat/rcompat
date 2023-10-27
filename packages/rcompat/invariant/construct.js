export const constructible = value => {
  try {
    Reflect.construct(String, [], value);
    return true;
  } catch (error) {
    return false;
  }
};

export const inconstructible = value => !constructible(value);

export const inconstructible_function =
  value => inconstructible(value) && typeof value === "function";
