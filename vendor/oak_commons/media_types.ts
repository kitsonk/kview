// Copyright 2018-2025 the oak authors. All rights reserved. MIT license.
// deno-lint-ignore-file no-irregular-whitespace

/**
 * Several APIs designed for processing of media types in request bodies.
 *
 * `MediaType`, `parse()` and `format()` are inspired media-typer at
 * https://github.com/jshttp/media-typer/ which is licensed as follows:
 *
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 *
 * MIT License
 *
 * `matches()` is inspired by type-is at https://github.com/jshttp/type-is/
 * which is licensed as follows:
 *
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 *
 * MIT License
 *
 * @module
 */

import { typeByExtension } from "jsr:@std/media-types@^1.0/type-by-extension";

const SUBTYPE_NAME_RE = /^[A-Za-z0-9][A-Za-z0-9!#$&^_.-]{0,126}$/;
const TYPE_NAME_RE = /^[A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126}$/;
const TYPE_RE =
  /^ *([A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126})\/([A-Za-z0-9][A-Za-z0-9!#$&^_.+-]{0,126}) *$/;

function mediaTypeMatch(expected: string | undefined, actual: string): boolean {
  if (!expected) {
    return false;
  }

  const actualParts = actual.split("/");
  const expectedParts = expected.split("/");

  if (actualParts.length !== 2 || expectedParts.length !== 2) {
    return false;
  }

  const [actualType, actualSubtype] = actualParts;
  const [expectedType, expectedSubtype] = expectedParts;

  if (expectedType !== "*" && expectedType !== actualType) {
    return false;
  }

  if (expectedSubtype.substring(0, 2) === "*+") {
    return expectedSubtype.length <= actualSubtype.length + 1 &&
      expectedSubtype.substring(1) ===
        actualSubtype.substring(
          actualSubtype.length + 1 - expectedSubtype.length,
        );
  }

  if (expectedSubtype !== "*" && expectedSubtype !== actualSubtype) {
    return false;
  }

  return true;
}

function normalize(mediaType: string): string | undefined {
  if (mediaType === "urlencoded") {
    return "application/x-www-form-urlencoded";
  }
  if (mediaType === "multipart") {
    return "multipart/*";
  }
  if (mediaType.startsWith("+")) {
    return `*/*${mediaType}`;
  }
  return mediaType.includes("/") ? mediaType : typeByExtension(mediaType);
}

function normalizeType(value: string): string | undefined {
  try {
    const [type] = value.split(/\s*;/);
    const mediaType = MediaType.parse(type);
    return mediaType.toString();
  } catch {
    return undefined;
  }
}

/** A class which encapsulates the information in a media type, allowing
 * inspecting of modifying individual parts of the media type. */
export class MediaType {
  #subtype!: string;
  #suffix?: string;
  #type!: string;

  /** Create an instance of {@linkcode MediaType} by providing the components
   * of `type`, `subtype` and optionally a `suffix`. */
  constructor(type: string, subtype: string, suffix?: string) {
    this.type = type;
    this.subtype = subtype;
    if (suffix) {
      this.suffix = suffix;
    }
  }

  /** The subtype of the media type. */
  set subtype(value: string) {
    if (!SUBTYPE_NAME_RE.test(value)) {
      throw new TypeError("Invalid subtype.");
    }
    this.#subtype = value;
  }

  /** The subtype of the media type. */
  get subtype(): string {
    return this.#subtype;
  }

  /** The optional suffix of the media type. */
  set suffix(value: string | undefined) {
    if (value && !TYPE_NAME_RE.test(value)) {
      throw new TypeError("Invalid suffix.");
    }
    this.#suffix = value;
  }

  /** The optional suffix of the media type. */
  get suffix(): string | undefined {
    return this.#suffix;
  }

  /** The type of the media type. */
  set type(value: string) {
    if (!TYPE_NAME_RE.test(value)) {
      throw new TypeError("Invalid type.");
    }
    this.#type = value;
  }

  /** The type of the media type. */
  get type(): string {
    return this.#type;
  }

  /** Return the parsed media type in its valid string format. */
  toString(): string {
    return this.#suffix
      ? `${this.#type}/${this.#subtype}+${this.#suffix}`
      : `${this.#type}/${this.#subtype}`;
  }

  /** Take a string and attempt to parse it into a {@linkcode MediaType}
   * object. */
  static parse(value: string): MediaType {
    const match = TYPE_RE.exec(value.toLowerCase());

    if (!match) {
      throw new TypeError("Invalid media type.");
    }

    let [, type, subtype] = match;
    let suffix: string | undefined;

    const idx = subtype.lastIndexOf("+");
    if (idx >= 0) {
      suffix = subtype.substring(idx + 1);
      subtype = subtype.substring(0, idx);
    }

    return new this(type, subtype, suffix);
  }
}

/** Determines if the provided media type matches one of the supplied media
 * types. If there is a match, the matched media type is returned, otherwise
 * `undefined` is returned.
 *
 * Each type in the media types array can be one of the following:
 *
 * - A file extension name such as `json`. This name will be returned if
 *   matched.
 * - A media type such as `application/json`.
 * - A media type with a wildcard such as `*​/*` or `*​/json` or `application/*`.
 *   The full media type will be returned if matched.
 * - A suffix such as `+json`. This can be combined with a wildcard such as
 *   `*​/vnd+json` or `application/*+json`. The full mime type will be returned
 *   if matched.
 * - Special cases of `urlencoded` and `multipart` which get normalized to
 *   `application/x-www-form-urlencoded` and `multipart/*` respectively.
 */
export function matches(
  value: string,
  mediaTypes: string[],
): string | undefined {
  const normalized = normalizeType(value);

  if (!normalized) {
    return undefined;
  }

  if (!mediaTypes.length) {
    return normalized;
  }

  for (const mediaType of mediaTypes) {
    if (mediaTypeMatch(normalize(mediaType), normalized)) {
      return mediaType.startsWith("+") || mediaType.includes("*")
        ? normalized
        : mediaType;
    }
  }

  return undefined;
}

/**
 * Convert a type, subtype and optional suffix of a media type into its valid
 * string form.
 */
export function format(
  value: { type: string; subtype: string; suffix?: string },
): string {
  const mediaType = value instanceof MediaType
    ? value
    : new MediaType(value.type, value.subtype, value.suffix);
  return mediaType.toString();
}

/** Parses a media type into a {@linkcode MediaType} object which provides
 * parts of the media type as individual properties. */
export function parse(value: string): MediaType {
  return MediaType.parse(value);
}
