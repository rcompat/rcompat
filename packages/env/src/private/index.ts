import js_env from "#js-env";
import FileRef from "@rcompat/fs/FileRef";
import root from "@rcompat/fs/project/root";
import { parse } from "dotenv";

const env = (await root()).join(`.env${js_env ? `.${js_env}` : ""}`);
const local = new FileRef(`${env.path}.local`);

const is_local = async () => await local.exists() ? local : env;
const read = async () => parse(await (await is_local()).text());

export default async function tryRead() {
  try {
    return await read();
  } catch {
    return {};
  }
}
