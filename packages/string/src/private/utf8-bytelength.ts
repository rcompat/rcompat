import native from "#native";

export default function utf8ByteLength(string: string): number {
    return native.utf8ByteLength(string);
}
