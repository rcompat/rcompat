import type Actions from "#Actions";

type Server = {
  stop(): void;
  upgrade(request: Request, actions: Actions): null;
};

export { Server as default };
