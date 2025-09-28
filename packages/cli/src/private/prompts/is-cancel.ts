const CANCEL = Symbol.for("@rcompat/cli.prompts.CANCEL");

export default (v: unknown): v is typeof CANCEL => v === CANCEL;
