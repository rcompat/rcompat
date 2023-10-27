import Path from "./Path.js";

export default test => {
  test.case("root", async assert => {
    assert((await Path.root()).path.endsWith("rcompat")).true();
  });
};
