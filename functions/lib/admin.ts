import type { Env } from "./respond";

const TOKENINFO_URL = "https://oauth2.googleapis.com/tokeninfo?id_token=";

type TokenInfo = { aud: string; email: string; email_verified: string };

export const denialReason = async (request: Request, env: Env) => {
  const token = request.headers.get("Authorization")?.replace(/^Bearer /, "");
  if (!token) return "no credential sent";
  if (!env.ADMIN_EMAILS) return "ADMIN_EMAILS is not set in this deployment";
  if (!env.GOOGLE_CLIENT_ID) return "GOOGLE_CLIENT_ID is not set in this deployment";
  const response = await fetch(TOKENINFO_URL + encodeURIComponent(token));
  if (!response.ok) return `Google rejected the token (${response.status})`;
  const info = (await response.json()) as TokenInfo;
  if (info.aud !== env.GOOGLE_CLIENT_ID) return "GOOGLE_CLIENT_ID does not match the client ID in the page";
  if (info.email_verified !== "true") return `${info.email} is not verified by Google`;
  const allowed = env.ADMIN_EMAILS.toLowerCase().split(",").map((email) => email.trim());
  return allowed.includes(info.email.toLowerCase()) ? null : `${info.email} is not in ADMIN_EMAILS`;
};
