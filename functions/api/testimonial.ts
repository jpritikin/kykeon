import { type Env, redirectWithStatus } from "../lib/respond";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const form = await request.formData();
  const body = String(form.get("body") ?? "").trim();
  const name = String(form.get("name") ?? "").trim().slice(0, 80) || null;
  if (form.get("website") || !body || body.length > 4000) {
    return redirectWithStatus(request, "/sacrament/", "invalid");
  }
  await env.DB.prepare("INSERT INTO testimonials (name, body) VALUES (?, ?)").bind(name, body).run();
  return redirectWithStatus(request, "/sacrament/", "ok");
};
