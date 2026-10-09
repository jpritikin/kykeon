import { type Env, redirectWithStatus } from "../lib/respond";
import { passesTurnstile } from "../lib/turnstile";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const bookCopy = form.get("book_copy");
  if (form.get("website") || (bookCopy !== "yes" && bookCopy !== "no") || !EMAIL_PATTERN.test(email) || email.length > 254 || !(await passesTurnstile(request, form, env))) {
    return redirectWithStatus(request, "/membership/#signup", "invalid");
  }
  const wantsBookCopy = bookCopy === "yes" ? 1 : 0;
  await env.DB.prepare(
    "INSERT INTO subscribers (email, wants_book_copy) VALUES (?, ?) ON CONFLICT(email) DO UPDATE SET wants_book_copy = MAX(wants_book_copy, excluded.wants_book_copy)",
  ).bind(email, wantsBookCopy).run();
  return redirectWithStatus(request, "/membership/#signup", "ok");
};
