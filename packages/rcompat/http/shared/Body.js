import { tryreturn } from "rcompat/async";

import {
  APPLICATION_FORM_URLENCODED,
  APPLICATION_JSON,
  MULTIPART_FORM_DATA,
  TEXT_PLAIN,
} from "./MediaType.js";

const formdata = async request =>
  Object.fromEntries((await request.formData()).entries());

const contents = {
  [APPLICATION_JSON]: request => request.json(),
  [APPLICATION_FORM_URLENCODED]: formdata,
  [MULTIPART_FORM_DATA]: formdata,
  [TEXT_PLAIN]: request => request.text(),
};

export default {
  async parse(request) {
    const type = request.headers.get("content-type");

    return type === null
      ? null
      : tryreturn(async _ => contents[type?.split(";")[0]]?.(request))
        .orelse(_ => {
          throw new Error(`cannot parse body with content type ${type}`);
        });
  },
};
