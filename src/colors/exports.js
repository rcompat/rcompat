const color = number => message => `\x1b[${number}m${message}\x1b[0m`;

const colors = {
  bold: 1,
  dim: 2,
  inverse: 7,

  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
  gray: 90,
};

export const bold = color(colors.bold);
export const dim = color(colors.dim);
export const inverse = color(colors.inverse);

export const black = color(colors.black);
export const red = color(colors.red);
export const green = color(colors.green);
export const yellow = color(colors.yellow);
export const blue = color(colors.blue);
export const magenta = color(colors.magenta);
export const cyan = color(colors.cyan);
export const white = color(colors.white);
export const gray = color(colors.gray);
export const grey = gray;
