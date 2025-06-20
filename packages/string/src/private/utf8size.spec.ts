import size from "#utf8size";
import test from "@rcompat/test";

test.case("ascii (1 byte)", assert => {
  assert(size("a")).equals(1);
  assert(size("Z")).equals(1);
  assert(size("aZ")).equals(2);
});

test.case("2 bytes", assert => {
  assert(size("ä")).equals(2);
  assert(size("ß")).equals(2);
  assert(size("äß")).equals(4);
});

test.case("3 bytes", assert => {
  assert(size("€")).equals(3);
  assert(size("漢")).equals(3);
  assert(size("€漢")).equals(6);
});

test.case("4 bytes", assert => {
  assert(size("𐍈")).equals(4);
  assert(size("😀")).equals(4);
  assert(size("𐍈😀")).equals(8);
});

test.case("mixed", assert => {
  assert(size("aä€𐍈")).equals(10);
});
