import process from "node:process";
import { parse } from "dotenv";
import { runtime } from "rcompat/meta";
import { Path } from "rcompat/fs";
import { tryreturn } from "rcompat/async";

const { JS_ENV } = runtime === "bun" ? Bun.env : process.env;
const root = await Path.root();
const env = root.join(`.env${JS_ENV ? `.${JS_ENV}` : ""}`);
const local = new Path(`${env.path}.local`);

const is_local = async _ => await local.exists() ? local : env;
const read = async _ => parse(await (await is_local()).text());

export default await tryreturn(_ => read()).orelse(_ => ({}));

const { env: user } = process;

export { user };
