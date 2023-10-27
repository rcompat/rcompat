import NodeFile from "./NodeFile.js";
import BunFile from "./BunFile.js";
import { runtime } from "rcompat/meta";

export default runtime === "bun" ? BunFile : NodeFile;
