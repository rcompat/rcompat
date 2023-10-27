const { fetch, FormData, Headers, URL, URLSearchParams } = globalThis;
export { fetch, FormData, Headers, URL, URLSearchParams };

export { default as Response } from "./Response.js";
export { default as Request } from "./Request.js";
export * as Status from "./Status.js";
export * as MediaType from "./MediaType.js";
export { default as serve } from "./serve.js";

