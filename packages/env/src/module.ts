import js_env from "#js-env";
import tryreturn from "@rcompat/async/tryreturn";
import FileRef from "@rcompat/fs/FileRef";
import root from "@rcompat/package/root";
import { parse } from "dotenv";
import process from "node:process";

const env = (await root()).join(`.env${js_env? `.${js_env}` : ""}`);
const local = FileRef.new(`${env.path}.local`);

const is_local = async () => await local.exists() ? local : env;
const read = async () => parse(await (await is_local()).text());

export default await tryreturn(() => read()).orelse(async () => ({}));

const { env: user } = process;

export { user };
