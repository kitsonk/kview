const HOST_OBJECT = Symbol.for("Deno.core.hostObject");

/**
 * Determines if the version of Deno supports serialization of Web standard objects like `Blob` and `File`.
 */
export function supportsWebSerialization(): boolean {
  return HOST_OBJECT in Blob.prototype;
}
