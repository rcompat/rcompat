export default function mock_import(specifier: string) {
  return import(`${specifier}?mock=${Date.now()}`);
}
