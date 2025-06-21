import type RequestLike from "#RequestLike";
import tryreturn from "@rcompat/async/tryreturn";
import { form, json, multipart, txt } from "@rcompat/http/mime";
import type Dictionary from "@rcompat/type/Dictionary";

const formdata = async (request: RequestLike): Promise<Dictionary> =>
  Object.fromEntries((await request.formData()).entries());

const contents = {
  [json]: (request: RequestLike) => request.json() as Promise<Dictionary>,
  [form]: formdata,
  [multipart]: formdata,
  [txt]: (request: RequestLike) => request.text(),
};

const is_supported = (type: string): type is keyof typeof contents =>
  type in contents;

export default {
  async parse(request: Request): Promise<null | string | Dictionary> {
    const type = request.headers.get("content-type");

    return type === null
      ? null
      : tryreturn(async () => {
          const contentType = type.split(";")[0];

          return is_supported(contentType)
            ? contents[contentType](request)
            : null;
        })
        .orelse(_ => {
          throw new Error(`cannot parse body with content type ${type}`);
        });
  },
};

