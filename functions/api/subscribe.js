const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost({ request, env }) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (form.get("website") || !EMAIL_PATTERN.test(email) || email.length > 254) {
    return Response.redirect(new URL("/join/?status=invalid", request.url), 303);
  }
  await env.DB.prepare("INSERT OR IGNORE INTO subscribers (email) VALUES (?)").bind(email).run();
  return Response.redirect(new URL("/join/?status=ok", request.url), 303);
}
