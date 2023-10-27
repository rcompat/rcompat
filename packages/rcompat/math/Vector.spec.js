import Vector from "./Vector.js";

export default test => {
  test.case("constructor", assert => {
    assert(() => new Vector()).throws();
    assert(() => new Vector(1)).nthrows();
  });

  test.case("length", assert => {
    assert(new Vector(0, 0).length).equals(0);
    assert(new Vector(0, 1).length).equals(1);
    assert(new Vector(1, 2).length).equals(Math.sqrt(5));
    assert(new Vector(1, 2, 3).length).equals(Math.sqrt(14));
    assert(new Vector(2, -5, 4).length).equals(3*Math.sqrt(5));
    assert(new Vector(1, 2, 3, 4).length).equals(Math.sqrt(30));
  });

  test.case("size", assert => {
    assert(new Vector(0, 0).size).equals(2);
    assert(new Vector(0, 1, 2).size).equals(3);
    assert(new Vector(1, 2, 3, 4).size).equals(4);
    assert(new Vector(5, 6, 7).size).equals(3);
    assert(new Vector(8).size).equals(1);
  });

  test.case("add", assert => {
    assert(new Vector(0, 1).add(new Vector(1, 0)).toString()).equals("{1,1}");
    assert(new Vector(2, 3).add(new Vector(4, 5)).toString()).equals("{6,8}");
    assert(new Vector(1, 2, 3).add(new Vector(4, 5, 6)).toString())
      .equals("{5,7,9}");
    assert(new Vector(2, -1, 0).add(new Vector(1, 2, -3)).toString())
      .equals("{3,1,-3}");
    assert(new Vector(1, 2, 3, 4).add(new Vector(5, 6, 7, 8)).toString())
      .equals("{6,8,10,12}");
  });

  test.case("multiply", assert => {
    assert(new Vector(1, 2).multiply(new Vector(3, 4))).equals(11);
    assert(new Vector(2, 3, 4).multiply(new Vector(5, 6, 7))).equals(56);
    assert(new Vector(1, 0, -1).multiply(new Vector(1, 0, 1))).equals(0);
    assert(new Vector(2, -1, 3).multiply(new Vector(1, 2, -3))).equals(-9);
    assert(new Vector(0, 1, 2, 3).multiply(new Vector(4, 5, 6, 7))).equals(38);
  });

  test.case("at", assert => {
    assert(new Vector(1, 2).at(0)).equals(1);
    assert(new Vector(2, 3, 4).at(2)).equals(4);
    assert(new Vector(1, 0, -1).at(1)).equals(0);
    assert(new Vector(2, -1, 3).at(1)).equals(-1);
    assert(new Vector(0, 1, 2, 3).at(3)).equals(3);
    assert(new Vector(0, 1, 2, 3).at(4)).undefined();
    assert(new Vector(1, 2).at(-1)).equals(2);
    assert(new Vector(2, 3, 4).at(-3)).equals(2);
    assert(new Vector(1, 0, -1).at(-1)).equals(-1);
    assert(new Vector(2, -1, 3).at(-2)).equals(-1);
    assert(new Vector(0, 1, 2, 3).at(-4)).equals(0);
    assert(new Vector(0, 1, 2, 3).at(-5)).undefined();
  });

  test.case("toString", assert => {
    assert(new Vector(1, 2).toString()).equals("{1,2}");
    assert(new Vector(2, 3, 4).toString()).equals("{2,3,4}");
    assert(new Vector(1, 0, -1).toString()).equals("{1,0,-1}");
    assert(new Vector(2, -1, 3).toString()).equals("{2,-1,3}");
    assert(new Vector(0, 1, 2, 3).toString()).equals("{0,1,2,3}");
  });
};
