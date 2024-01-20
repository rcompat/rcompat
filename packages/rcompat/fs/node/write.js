import { writeFile } from "node:fs/promises";

export default (...args) => writeFile(...args);
