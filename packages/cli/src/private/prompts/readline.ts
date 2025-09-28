import readline from "@rcompat/stdio/readline";

let chain: Promise<unknown> = Promise.resolve();

export default function readOneLine(): Promise<null | string> {
  // Serialize reads: queue the next after the previous settles.
  const next = chain.then(() => readline());
  // Update chain regardless of success/failure to keep queue moving.
  chain = next.then(() => undefined, () => undefined);
  return next as Promise<null | string>;
}
