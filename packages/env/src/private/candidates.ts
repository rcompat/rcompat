export default function candidates(name?: string): string[] {
  return [
    name !== undefined && name.length > 0 && `.env.${name}.local`,
    name !== undefined && name.length > 0 && `.env.${name}`,
    ".env.local",
    ".env",
  ].filter(Boolean) as string[];
}
