import { is } from "rcompat/invariant";

export default trial => ({
  orelse(backup) {
    is(trial).function();
    is(backup).function();

    try {
      return trial();
    } catch (error) {
      return backup(error);
    }
  },
});
