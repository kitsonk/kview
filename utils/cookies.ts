import { KeyStack } from "$std/crypto/keystack.ts";
export { mergeHeaders, SecureCookieMap } from "$std/http/cookie_map.ts";

export const ACCESS_TOKEN = "access_token";
export const STORE_NAMES = "store_names";

export const keys = new KeyStack(
  Deno.env.get("KEY_STACK_KEYS")?.split(/\s*,\s*/) ?? ["kview"],
);
