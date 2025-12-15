import io from "@rcompat/io";

export default (...messages: string[]) => io.stdout.write(messages.join(" "));
