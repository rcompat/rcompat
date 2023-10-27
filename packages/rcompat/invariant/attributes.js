const number = value => !Number.isNaN(Number.parseFloat(value))
  && Number.isFinite(Number(value));

const isNumeric = value => typeof value === "string" && number(value);

export const numeric = value => {
  try {
    return isNumeric(value);
  } catch (_) {
    return false;
  }
};

export const boolish = value => value === "true" || value === "false";

export const nullish = value => value === undefined || value === null;
