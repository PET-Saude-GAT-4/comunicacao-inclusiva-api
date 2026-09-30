import { env } from "@/config/env.js";

export function concatWithBaseUrl(p: string) {
  return new URL(p, env.apiBaseUrl).href;
}

export function concatWithFrontendUrl(p: string) {
  return new URL(p, env.frontendBaseUrl).href;
}
