import process from "node:process";
import { parse } from "dotenv";
import file from "@rcompat/fs/file";
import root from "@rcompat/package/root";
import tryreturn from "@rcompat/async/tryreturn";
import js_env from "#js-env";

const env = (await root()).join(`.env${js_env? `.${js_env}` : ""}`);
const local = file(`${env.path}.local`);

const is_local = async () => await local.exists() ? local : env;
const read = async () => parse(await (await is_local()).text());

export default await tryreturn(() => read()).orelse(async () => ({}));

const { env: user } = process;

export { user };
