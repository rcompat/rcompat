export default interface Actions extends Record<string, unknown> {
  close?: (x: any) => unknown;
  message?: (socket: any, message: Buffer | string) => unknown;
  open?: (x: any) => unknown;
}
