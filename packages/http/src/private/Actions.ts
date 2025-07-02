export default interface Actions extends Record<string, unknown> {
  message?: (socket: any, message: Buffer | string) => unknown;
  open?: (x: any) => unknown;
  close?: (x: any) => unknown;
}
