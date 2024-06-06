import process from "node:process";
import { parse } from "dotenv";
import { File } from "rcompat/fs";
import * as P from "rcompat/package";
import { tryreturn } from "rcompat/async";

const { JS_ENV } = P.platform() === "bun" ? Bun.env : process.env;
const env = (await P.root()).join(`.env${JS_ENV ? `.${JS_ENV}` : ""}`);
const local = new File(`${env.path}.local`);

const is_local = async () => await local.exists() ? local : env;
const read = async () => parse(await (await is_local()).text());

export default await tryreturn(() => read()).orelse(async () => ({}));

const { env: user } = process;

export { user };
