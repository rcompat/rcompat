import upperfirst from "@rcompat/string/upperfirst";

export default (string: string): string => string.toLowerCase().split(/[-_]/u)
  .map(part => upperfirst(part)).join("");
