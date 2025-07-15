// application
export const atom = "application/atom+xml";
export const bin = "application/octet-stream";
export const form = "application/x-www-form-urlencoded";
export const json = "application/json";
export const multipart = "multipart/form-data";
export const pdf = "application/pdf";
export const rss = "application/rss+xml";
export const xml = "application/xml";

// text
export const css = "text/css";
export const csv = "text/csv";
export const html = "text/html";
export const js = "text/javascript";
export const sse = "text/event-stream";
export const txt = "text/plain";

// image
export const jpeg = "image/jpeg";
export const jpg = "image/jpeg";
export const png = "image/png";
export const svg = "image/svg+xml";
export const webp = "image/webp";

// video
export const mp4 = "video/mp4";

// font
export const ttf = "font/ttf";
export const woff2 = "font/woff2";

const extensions = {
  atom, bin, form, json,  multipart, pdf, rss, xml,
  css, csv, html, js, sse, txt,
  jpeg, jpg, png, svg, webp,
  woff2,
} as const;

export type Extension = keyof typeof extensions;

export const DEFAULT_EXTENSION = extensions.bin;

export const isExtension = (extension: unknown): extension is Extension =>
  typeof extension === 'string' && extension in extensions;

const regex = /\.(?<extension>[a-z1-9]*)$/u;
const match = (filename: string) => filename.match(regex)?.groups?.extension;

export const resolve = (name: string) => {
  const matched = match(name);

  return isExtension(matched) ? extensions[matched] : DEFAULT_EXTENSION;
};
