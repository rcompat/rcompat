import utf8ByteLength from "#utf8-bytelength";
import test from "@rcompat/test";

test.case("ascii (1 byte)", assert => {
  assert(utf8ByteLength("a")).equals(1);
  assert(utf8ByteLength("Z")).equals(1);
  assert(utf8ByteLength("aZ")).equals(2);
});

test.case("2 bytes", assert => {
  assert(utf8ByteLength("ä")).equals(2);
  assert(utf8ByteLength("ß")).equals(2);
  assert(utf8ByteLength("äß")).equals(4);
});

test.case("3 bytes", assert => {
  assert(utf8ByteLength("€")).equals(3);
  assert(utf8ByteLength("漢")).equals(3);
  assert(utf8ByteLength("€漢")).equals(6);
});

test.case("4 bytes", assert => {
  assert(utf8ByteLength("𐍈")).equals(4);
  assert(utf8ByteLength("😀")).equals(4);
  assert(utf8ByteLength("𐍈😀")).equals(8);
});

test.case("mixed", assert => {
  assert(utf8ByteLength("aä€𐍈")).equals(10);
});
