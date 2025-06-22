import type Options from "#api/Options";
import type Statement from "#api/Statement";
import defaults from "#api/defaults";

export default abstract class Database {
  constructor(path: string, options: Options = defaults) {}

  abstract close(): void;

  abstract query<Params, ReturnType>(sql: string): Statement;
}
