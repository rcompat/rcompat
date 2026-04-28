import CANCEL from "#prompts/symbol";

export default (v: unknown): v is typeof CANCEL => v === CANCEL;
