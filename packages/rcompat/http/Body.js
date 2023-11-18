import { from } from "rcompat/object";
import { tryreturn } from "rcompat/async";
import { stringify } from "rcompat/streams";

import { APPLICATION_FORM_URLENCODED, APPLICATION_JSON } from "./MediaType.js";

const { decodeURIComponent: decode } = globalThis;

const contents = {
  [APPLICATION_FORM_URLENCODED]: body => from(body.split("&")
    .map(part => part.split("=")
      .map(subpart => decode(subpart).replaceAll("+", " ")))),
  [APPLICATION_JSON]: body => JSON.parse(body),
};

export default {
  parse(body, type) {
    return type === null
      ? null
      : tryreturn(async _ =>
        contents[type?.split(";")[0]]?.(await stringify(body)))
        .orelse(_ => {
          throw new Error(`cannot parse body with content type ${type}`);
        });
  },
};
