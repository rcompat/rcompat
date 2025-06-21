import type Options from "#api/Options";
import type Statement from "#api/Statement";

export default abstract class Database {
  constructor(path: string, options: Options) {}

  abstract close(): void;

  abstract query<Params, ReturnType>(sql: string): Statement<Params, ReturnType>;
}
