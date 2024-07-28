export default (number: number) =>
  (message: string) =>
    `\x1b[${number}m${message}\x1b[0m`;
