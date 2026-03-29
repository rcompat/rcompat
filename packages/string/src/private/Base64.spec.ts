import Base64 from "#Base64";
import test from "@rcompat/test";

test.case("there and back again", assert => {
  assert(Base64.decode(Base64.encode("Hi"))).equals("Hi");
});

test.case("unicode round-trip", assert => {
  assert(Base64.decode(Base64.encode("héllo"))).equals("héllo");
  assert(Base64.decode(Base64.encode("日本語"))).equals("日本語");
  assert(Base64.decode(Base64.encode("🎉"))).equals("🎉");
});
