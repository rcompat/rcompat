import { parse } from "dotenv";
import { runtime } from "rcompat/meta";
import { Path } from "rcompat/fs";
import { tryreturn } from "rcompat/async";

const { JS_ENV } = runtime === "bun" ? Bun.env : process.env;
const root = await Path.root();
const env = root.join(`.env${JS_ENV ? `.${JS_ENV}` : ""}`);
const local = new Path(`${env.path}.local`);

const read = async () => parse(await (await local.exists ? local : env).text());

export default await tryreturn(_ => read()).orelse(_ => ({}));
