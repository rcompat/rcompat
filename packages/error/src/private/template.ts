import TemplateError from "#TemplateError";

export default function template(
  strings: TemplateStringsArray,
  ...params: unknown[]) {
  return new TemplateError(strings, ...params);
}
