import is_secure from "./is-secure.js";

export default async conf => is_secure(conf)
  ? {
    key: await conf.ssl.key.file.read(),
    cert: await conf.ssl.cert.file.read(),
  } : {};
