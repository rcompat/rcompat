import PseudoRequest from "#PseudoRequest";

type Handler = (request: Request | PseudoRequest) =>
  Response | Promise<Response>;

export default Handler;
