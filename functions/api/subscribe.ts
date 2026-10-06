import { type Env, redirectWithStatus } from "../lib/respond";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (form.get("website") || !EMAIL_PATTERN.test(email) || email.length > 254) {
    return redirectWithStatus(request, "/membership/#signup", "invalid");
  }
  await env.DB.prepare("INSERT OR IGNORE INTO subscribers (email) VALUES (?)").bind(email).run();
  return redirectWithStatus(request, "/membership/#signup", "ok");
};
