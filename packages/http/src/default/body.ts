import type RequestLike from "#types/RequestLike";
import tryreturn from "@rcompat/async/tryreturn";
import { form, json, multipart, txt } from "@rcompat/http/mime";

const formdata = async (request: RequestLike) =>
  Object.fromEntries((await request.formData()).entries());

const contents = {
  [json]: (request: RequestLike) => request.json(),
  [form]: formdata,
  [multipart]: formdata,
  [txt]: (request: RequestLike) => request.text(),
};

const isSupported = (type: string): type is keyof typeof contents => type in contents;

export default {
  async parse(request: Request) {
    const type = request.headers.get("content-type");

    return type === null
      ? null
      : tryreturn(async () => {
          const contentType = type.split(";")[0];

          return isSupported(contentType) ? contents[contentType](request) : null;
        })
        .orelse(_ => {
          throw new Error(`cannot parse body with content type ${type}`);
        });
  },
};

