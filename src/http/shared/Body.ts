import { tryreturn } from "rcompat/async";
import { RequestLike } from "../types.js";

import {
  APPLICATION_FORM_URLENCODED,
  APPLICATION_JSON,
  MULTIPART_FORM_DATA,
  TEXT_PLAIN,
} from "./MediaType.js";

const formdata = async (request: RequestLike) =>
  Object.fromEntries((await request.formData()).entries());

const contents = {
  [APPLICATION_JSON]: (request: RequestLike) => request.json(),
  [APPLICATION_FORM_URLENCODED]: formdata,
  [MULTIPART_FORM_DATA]: formdata,
  [TEXT_PLAIN]: (request: RequestLike) => request.text(),
};

const isSupported = (type: string): type is keyof typeof contents => type in contents;

export default {
  async parse(request: Request) {
    const type = request.headers.get("content-type");

    return type === null
      ? null
      : tryreturn(async () => {
          const contentType = type?.split(";")[0];

          return isSupported(contentType) ? contents[contentType](request) : null;
        })
        .orelse(_ => {
          throw new Error(`cannot parse body with content type ${type}`);
        });
  },
};

