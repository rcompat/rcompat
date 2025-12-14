import type Native from "#native/type";

const node: Native = {
  utf8_bytelength(str: string) {
    return Buffer.byteLength(str, "utf8");
  },
};

export default node;
