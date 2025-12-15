import std from "@rcompat/io/std";

export default (...messages: string[]) => std.out.write(messages.join(" "));
