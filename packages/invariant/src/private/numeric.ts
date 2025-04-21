const number = (value: string): boolean =>
  !Number.isNaN(Number.parseFloat(value)) && Number.isFinite(Number(value));

const isNumeric = (value: string): boolean =>
  typeof value === "string" && number(value);

export default (value: string): boolean => {
  try {
    return isNumeric(value);
  } catch (_) {
    return false;
  }
};
