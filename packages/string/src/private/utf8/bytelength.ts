import native from "#native";

export default function utf8Bytelength(string: string): number {
  return native.utf8_bytelength(string);
}
