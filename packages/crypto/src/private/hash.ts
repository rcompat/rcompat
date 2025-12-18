//import assert from "@rcompat/assert";
import type { TypedArray } from "@rcompat/type";

const encoder = new TextEncoder();

type Algorithm = "SHA-256" | "SHA-384" | "SHA-512";

export default async function hash(
  data: string | ArrayBuffer | TypedArray,
  algorithm: Algorithm = "SHA-256",
): Promise<string> {
  //assert.in(algorithm, ["SHA-256", "SHA-384", "SHA-512"]);

  const to_digest = typeof data === "string"
    ? encoder.encode(data)
    : data;

  const digest = await crypto.subtle.digest(algorithm, to_digest);

  return Array.from(new Uint8Array(digest))
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}
