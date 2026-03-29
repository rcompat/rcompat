import error from "@rcompat/error";

const t = error.template;

function double_route(route: string) {
  return t`double route ${route}`;
}
function optional_route(route: string) {
  return t`optional routes must be leaves ${route}`;
}
function rest_route(route: string) {
  return t`rest routes must be leaves ${route}`;
}
function double_param(param: string) {
  return t`double param ${param}`;
}

const errors = error.coded({
  double_route,
  optional_route,
  rest_route,
  double_param,
});

export default errors;
export type Code = keyof typeof errors;
export const Code = Object.fromEntries(
  Object.keys(errors).map(k => [k, k])) as { [K in Code]: K };
