import tests from "#tests";

export default function* run() {
  for (const test of tests) {
    test.run();
    yield test;
  }
};
