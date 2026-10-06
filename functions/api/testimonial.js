export async function onRequestPost({ request, env }) {
  const form = await request.formData();
  const body = String(form.get("body") ?? "").trim();
  const name = String(form.get("name") ?? "").trim().slice(0, 80) || null;
  if (form.get("website") || !body || body.length > 4000) {
    return Response.redirect(new URL("/testimonials/?status=invalid", request.url), 303);
  }
  await env.DB.prepare("INSERT INTO testimonials (name, body) VALUES (?, ?)").bind(name, body).run();
  return Response.redirect(new URL("/testimonials/?status=ok", request.url), 303);
}
