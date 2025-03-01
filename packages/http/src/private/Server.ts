import type Actions from "#Actions";

type Server = {
  upgrade(request: Request, actions: Actions): undefined;
  stop(): undefined;
}

export { Server as default };
