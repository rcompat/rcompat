import NativeResponse from "./NativeResponse.js";
import NodeResponse from "./NodeResponse.js";
import { runtime } from "rcompat/meta";

export default runtime === "node" ? NodeResponse : NativeResponse;
