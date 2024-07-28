import process from "node:process";
import { parse } from "dotenv";
import fileref from "@rcompat/fs/fileref";
import platform from "@rcompat/platform";
import root from "@rcompat/package/root";
import tryreturn from "@rcompat/async/tryreturn";

// @ts-expect-error can be different platform
const { JS_ENV } = platform === "bun" ? Bun.env : process.env;
const env = (await root()).join(`.env${JS_ENV ? `.${JS_ENV}` : ""}`);
const local = fileref(`${env.path}.local`);

const is_local = async () => await local.exists() ? local : env;
const read = async () => parse(await (await is_local()).text());

export default await tryreturn(() => read()).orelse(async () => ({}));

const { env: user } = process;

export { user };
