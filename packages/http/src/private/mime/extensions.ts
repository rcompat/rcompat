import atom from "#mime/application/atom+xml";
import gz from "#mime/application/gzip";
import json from "#mime/application/json";
import jsonld from "#mime/application/ld+json";
import webmanifest from "#mime/application/manifest+json";
import bin from "#mime/application/octet-stream";
import pdf from "#mime/application/pdf";
import rss from "#mime/application/rss+xml";
import wasm from "#mime/application/wasm";
import _7z from "#mime/application/x-7z-compressed";
import bz2 from "#mime/application/x-bzip2";
import rar from "#mime/application/x-rar-compressed";
import tar from "#mime/application/x-tar";
import xml from "#mime/application/xml";
import yaml from "#mime/application/yaml";
import zip from "#mime/application/zip";
import mp3 from "#mime/audio/mpeg";
import ogg from "#mime/audio/ogg";
import wav from "#mime/audio/wav";
import weba from "#mime/audio/webm";
import otf from "#mime/font/otf";
import ttf from "#mime/font/ttf";
import woff from "#mime/font/woff";
import woff2 from "#mime/font/woff2";
import apng from "#mime/image/apng";
import avif from "#mime/image/avif";
import bmp from "#mime/image/bmp";
import gif from "#mime/image/gif";
import jpeg from "#mime/image/jpeg";
import png from "#mime/image/png";
import svg from "#mime/image/svg+xml";
import tiff from "#mime/image/tiff";
import webp from "#mime/image/webp";
import ico from "#mime/image/x-icon";
import css from "#mime/text/css";
import csv from "#mime/text/csv";
import html from "#mime/text/html";
import js from "#mime/text/javascript";
import md from "#mime/text/markdown";
import txt from "#mime/text/plain";
import rtf from "#mime/text/rtf";
import tsv from "#mime/text/tab-separated-values";
import vtt from "#mime/text/vtt";
import ts from "#mime/video/mp2t";
import mp4 from "#mime/video/mp4";
import ogv from "#mime/video/ogg";
import mov from "#mime/video/quicktime";
import webm from "#mime/video/webm";

const extensions = {
  "7z": _7z,
  apng,
  atom,
  avif,
  bin,
  bmp,
  bz2,
  css,
  csv,
  gif,
  gz,
  htm: html,
  html,
  ico,
  jpeg,
  jpg: jpeg,
  js,
  json,
  jsonld,
  map: json,
  markdown: md,
  md,
  mjs: js,
  mov,
  mp3,
  mp4,
  ogg,
  ogv,
  otf,
  pdf,
  png,
  rar,
  rss,
  rtf,
  svg,
  tar,
  text: txt,
  tif: tiff,
  tiff,
  ts,
  tsv,
  ttf,
  txt,
  vtt,
  wasm,
  wav,
  weba,
  webm,
  webmanifest,
  webp,
  woff,
  woff2,
  xml,
  yaml,
  yml: yaml,
  zip,
} as const;

export default extensions;
