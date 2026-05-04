import { env } from "@/config/env.js";

export function concatWithBaseUrl(p: string) {
  return new URL(p, env.appBaseUrl).href;
}
