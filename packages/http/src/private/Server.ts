import type Actions from "#Actions";

type Server = {
  upgrade(request: Request, actions: Actions): null;
  stop(): void;
};

export { Server as default };
