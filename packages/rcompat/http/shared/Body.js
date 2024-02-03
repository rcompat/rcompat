import { from } from "rcompat/object";
import { tryreturn } from "rcompat/async";
import { stringify } from "rcompat/streams";

import {
  APPLICATION_FORM_URLENCODED,
  APPLICATION_JSON,
  MULTIPART_FORM_DATA,
} from "./MediaType.js";

const { decodeURIComponent: decode } = globalThis;

const contents = {
  [APPLICATION_FORM_URLENCODED]: async request =>
    from((await stringify(request.body)).split("&")
      .map(part => part.split("=")
        .map(subpart => decode(subpart).replaceAll("+", " ")))),
  [APPLICATION_JSON]: async ({ body }) => JSON.parse(await stringify(body)),
  [MULTIPART_FORM_DATA]: async request =>
    from((await request.formData()).entries()),
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
