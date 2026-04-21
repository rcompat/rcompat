import type Actions from "#Actions";
import type Conf from "#Conf";
import type Server from "#Server";
import type { ValidStatus } from "#Status";
import type { Method } from "#methods";
import methods from "#methods";
import toMIME from "#mime/resolve";

import MIME from "#mime/types";
import Status from "#Status";

const http = {
  methods,
  toMIME,
  MIME,
  Status,
};

export default http;

export type {
  Actions,
  Conf, Method, Server,
  ValidStatus,
};
