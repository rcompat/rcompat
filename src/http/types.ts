import { FlatFile } from "rcompat/fs";
import PseudoRequest from "./node/Request.js";

export interface Conf {
  host: string;
  port: number;
  ssl?: {
    key: FlatFile;
    cert: FlatFile;
  };
}

export type Handler = (request: Request | PseudoRequest) => Response;

export interface Actions extends Record<PropertyKey, unknown> {
  message?: (socket: any, message: Buffer | string) => unknown,
  open?: (x: any) => unknown,
  close?: (x: any) => unknown,
}

export type RequestLike = Request | PseudoRequest;
