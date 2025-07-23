type TemplateStrings = string | TemplateStringsArray;

export default function dedent(string: TemplateStrings, ...values: unknown[]) {
  let raw = typeof string === "string" ? [string] : string.raw;

  // Interpolate values into template string
  let result = "";
  for (let i = 0; i < raw.length; i++) {
    result += raw[i]
      .replace(/\\\n[ \t]*/g, "") // remove escaped newlines
      .replace(/\\`/g, "`");      // unescape escaped backticks
    if (i < values.length) result += values[i];
  }

  // Find minimum indent
  const lines = result.split("\n");
  const non_empty = lines.filter(line => line.trim().length > 0);
  const min_indent = Math.min(...non_empty
    .map(line => line.match(/^(\s*)/)![0].length));

  // Remove indent
  return lines.map(line => line.slice(min_indent)).join("\n").trim();
}
