import upperfirst from "#upperfirst";

export default function toCamelCase(string: string): string {
  return string
    .toLowerCase()
    .split(/[-_]/u)
    .map(part => upperfirst(part)).join("");
}
