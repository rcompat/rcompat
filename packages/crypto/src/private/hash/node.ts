import crypto from "node:crypto";

const encoder = new TextEncoder();

export default async function hash(
  data: string | ArrayBuffer | ArrayBufferView,
  algorithm = "SHA-256",
): Promise<string> {
  const toDigest = typeof data === "string"
    ? encoder.encode(data)
    : data;

  const digest = await crypto.subtle.digest(algorithm, toDigest);

  const base = 16;
  const target_pad_length = 2;
  const target_slice = 20;

  return Array.from(new Uint8Array(digest))
    .map(byte => byte.toString(base).padStart(target_pad_length, "0"))
    .join("")
    .slice(0, target_slice) + "n";
}
