import File from "./File.js";

export default test => {
  test.case("root", async assert => {
    assert((await File.root()).path.endsWith("rcompat")).true();
  });
};
