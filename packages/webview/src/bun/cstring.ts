import { ptr } from "bun:ffi";

const encoder = new TextEncoder();

export default (value: string) => ptr(encoder.encode(`${value}\0`));
