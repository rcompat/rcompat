import type { Dict } from "@rcompat/type";

export default interface Actions extends Dict {
  close?: (x: any) => unknown;
  message?: (socket: any, message: Buffer | string) => unknown;
  open?: (x: any) => unknown;
}
