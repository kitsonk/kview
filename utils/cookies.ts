import { KeyStack } from "@/vendor/oak_commons/keystack.ts";
export { mergeHeaders, SecureCookieMap } from "@/vendor/oak_commons/cookie_map.ts";

export const ACCESS_TOKEN = "access_token";
export const STORE_NAMES = "store_names";

export const keys = new KeyStack(
  Deno.env.get("KEY_STACK_KEYS")?.split(/\s*,\s*/) ?? ["kview"],
);
