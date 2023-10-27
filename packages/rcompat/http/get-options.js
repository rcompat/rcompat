import secure from "./secure.js";

export default async conf => secure(conf)
  ? {
    key: await conf.ssl.key.file.read(),
    cert: await conf.ssl.cert.file.read(),
  } : {};
