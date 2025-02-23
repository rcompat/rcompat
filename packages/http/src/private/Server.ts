import type Actions from "#Actions";
import PseudoRequest from "#PseudoRequest";

type Server = {
  upgrade(request: Request | PseudoRequest, actions: Actions): undefined;
  stop(): undefined;
}

export { Server as default };
