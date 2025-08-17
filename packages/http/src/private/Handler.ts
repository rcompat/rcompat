import type PseudoRequest from "#PseudoRequest";

type Handler = (request: PseudoRequest | Request) =>
  Promise<Response> | Response;

export default Handler;
