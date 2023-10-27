import NativeRequest from "./NativeRequest.js";
import NodeRequest from "./NodeRequest.js";
import { runtime } from "rcompat/meta";

export default runtime === "node" ? NodeRequest : NativeRequest;
