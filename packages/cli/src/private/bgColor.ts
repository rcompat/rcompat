function _(number: number) {
  return (message: string) =>
    `\x1b[${number}m${message}\x1b[0m`;
}

export default {
  black: _(40),
  blue: _(44),
  cyan: _(46),
  gray: _(100),
  green: _(42),
  magenta: _(45),
  red: _(41),
  white: _(47),
  yellow: _(43),
};
