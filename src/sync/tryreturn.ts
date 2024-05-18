import { is } from "rcompat/invariant";

export interface SyncTryReturnTrialBackup<T> {
  orelse:<U>(backup: SyncTryReturnTrialBackupFunction<U>) => T | U
}

export interface SyncTryReturnTrialBackupFunction<U> {
  (error: unknown): U
}

export interface SyncTryReturnTrialFunction<T> {
  (): T
}

export interface SyncTryReturnTrial {
  <T>(trial: SyncTryReturnTrialFunction<T>): SyncTryReturnTrialBackup<T>
}

export default (trial => ({
  orelse(backup) {
    is(trial).function();
    is(backup).function();

    try {
      return trial();
    } catch (error) {
      return backup(error);
    }
  },
})) satisfies SyncTryReturnTrial as SyncTryReturnTrial;
