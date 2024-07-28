import PseudoRequest from "@rcompat/http/#/pseudo-request";

type Handler = (request: Request | PseudoRequest) =>
  Response | Promise<Response>;

export default Handler;
