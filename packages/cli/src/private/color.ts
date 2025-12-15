function _(number: number) {
  return (message: string) =>
    `\x1b[${number}m${message}\x1b[0m`;
}

export default {
  black: _(30),
  blue: _(34),
  bold: _(1),
  cyan: _(36),
  dim: _(2),
  gray: _(90),
  green: _(32),
  inverse: _(7),
  magenta: _(35),
  red: _(31),
  white: _(37),
  yellow: _(33),
};
