import type Env from "#Env";

export default {
  globals() {
    return {
      secret: 123,
    };
  },
} satisfies Env;
