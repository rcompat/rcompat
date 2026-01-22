import js_env from "#js-env";
import fs from "@rcompat/fs";
import { parse } from "dotenv";

const env = (await fs.project.root()).join(`.env${js_env ? `.${js_env}` : ""}`);
const local = new fs.FileRef(`${env.path}.local`);

const is_local = async () => await local.exists() ? local : env;
const read = async () => parse(await (await is_local()).text());

let e = {};

try { e = await read(); } catch { }

export default e;
