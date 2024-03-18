import { KeyStack } from "@std/crypto/unstable_keystack";
export { mergeHeaders, SecureCookieMap } from "@oak/commons/cookie_map";

export const ACCESS_TOKEN = "access_token";
export const STORE_NAMES = "store_names";

export const keys = new KeyStack(
  Deno.env.get("KEY_STACK_KEYS")?.split(/\s*,\s*/) ?? ["kview"],
);
