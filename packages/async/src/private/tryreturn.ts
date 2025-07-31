import is from "@rcompat/assert/is";

const $backup = Symbol("backup");

interface AsyncTryReturnTrialBackup<T> extends PromiseLike<T> {
  [$backup]: AsyncTryReturnTrialBackupFunction<unknown> | undefined;
  orelse: <U>(backup: AsyncTryReturnTrialBackupFunction<U>) => AsyncTryReturnTrialBackup<T | U>;
}

interface AsyncTryReturnTrialBackupFunction<U> {
  (error: unknown): Promise<U>;
}

interface AsyncTryReturnTrialFunction<T> {
  (): Promise<T>;
}

interface AsyncTryReturnTrial {
  <T>(trial: AsyncTryReturnTrialFunction<T>): AsyncTryReturnTrialBackup<T>;
}

export default (trial => ({
  [$backup]: undefined,

  then(onFulfilled, onRejected) {
    return (async () => {
      is(trial).function();
      is(this[$backup]).defined("`tryreturn` executed without a backup");

      try {
        const maybePromiseTrial = await trial();

        return maybePromiseTrial instanceof Promise ? await maybePromiseTrial : maybePromiseTrial;
      } catch (error) {
        return this[$backup]!(error);
      }
    })().then(onFulfilled as never, onRejected);
  },

  orelse(backup) {
    is(trial).function();
    is(backup).function();
    this[$backup] = backup;

    return this;
  },
})) satisfies AsyncTryReturnTrial as AsyncTryReturnTrial;
