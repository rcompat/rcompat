import bytelength from "#utf8/bytelength";
import test from "@rcompat/test";

test.case("ascii (1 byte)", assert => {
  assert(bytelength("a")).equals(1);
  assert(bytelength("Z")).equals(1);
  assert(bytelength("aZ")).equals(2);
});

test.case("2 bytes", assert => {
  assert(bytelength("ä")).equals(2);
  assert(bytelength("ß")).equals(2);
  assert(bytelength("äß")).equals(4);
});

test.case("3 bytes", assert => {
  assert(bytelength("€")).equals(3);
  assert(bytelength("漢")).equals(3);
  assert(bytelength("€漢")).equals(6);
});

test.case("4 bytes", assert => {
  assert(bytelength("𐍈")).equals(4);
  assert(bytelength("😀")).equals(4);
  assert(bytelength("𐍈😀")).equals(8);
});

test.case("mixed", assert => {
  assert(bytelength("aä€𐍈")).equals(10);
});
