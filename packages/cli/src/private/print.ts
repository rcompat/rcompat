import stdout from "@rcompat/io/stdout";

export default (...messages: string[]) => stdout.write(messages.join(" "));
