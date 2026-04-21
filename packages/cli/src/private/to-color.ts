export default function toColor(number: number) {
  return (message: string) => `\x1b[${number}m${message}\x1b[0m`;
}
