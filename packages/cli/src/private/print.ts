import stdout from "@rcompat/stdio/stdout";

export default (...messages: string[]) => stdout.write(messages.join(" "));
