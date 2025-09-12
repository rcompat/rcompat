import dim from "#color/dim";

const stringify = (params: unknown[]) => params.map(param => {
  if (param?.toString !== undefined) {
    return param.toString();
  }
  if (param instanceof Error) {
    return param.message;
  }
  return param as string;
});

export default (format: string, ...params: unknown[]) =>
  stringify(params).reduce((formatted, param, i) =>
    formatted.replace(`{${i}}`, dim(param)), format);
