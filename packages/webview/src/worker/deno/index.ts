const unimplemented = (platform: string) => {
  throw new Error(`unimplmented: ${platform}`);
}

export default () => unimplemented("deno");
