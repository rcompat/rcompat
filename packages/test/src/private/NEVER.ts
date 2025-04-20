const NEVER = (value: unknown) => value as never;

NEVER.undefined = NEVER(undefined);

export default NEVER;
