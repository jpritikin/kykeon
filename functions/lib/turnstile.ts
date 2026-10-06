import type { Env } from "./respond";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export const passesTurnstile = async (request: Request, form: FormData, env: Env) => {
  const token = form.get("cf-turnstile-response");
  if (typeof token !== "string" || !token) return false;
  const body = new FormData();
  body.set("secret", env.TURNSTILE_SECRET);
  body.set("response", token);
  const ip = request.headers.get("CF-Connecting-IP");
  if (ip) body.set("remoteip", ip);
  const result = await fetch(VERIFY_URL, { method: "POST", body });
  return result.ok && ((await result.json()) as { success: boolean }).success;
};
