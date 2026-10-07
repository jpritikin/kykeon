import { type Env, redirectWithStatus } from "../lib/respond";
import { passesTurnstile } from "../lib/turnstile";

const optionalNumber = (value: FormDataEntryValue | null, integer: boolean) => {
  const text = String(value ?? "").trim();
  if (!text) return null;
  const number = Number(text);
  const valid = Number.isFinite(number) && number >= 0 && number <= 100000 && (!integer || Number.isInteger(number));
  return valid ? number : NaN;
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const form = await request.formData();
  const body = String(form.get("body") ?? "").trim();
  const name = String(form.get("name") ?? "").trim().slice(0, 80) || null;
  const seeds = optionalNumber(form.get("seeds"), true);
  const thhMg = optionalNumber(form.get("thh_mg"), false);
  if (form.get("website") || !body || body.length > 4000 || Number.isNaN(seeds) || Number.isNaN(thhMg) || !(await passesTurnstile(request, form, env))) {
    return redirectWithStatus(request, "/sacrament/", "invalid");
  }
  await env.DB.prepare("INSERT INTO testimonials (name, body, seeds, thh_mg) VALUES (?, ?, ?, ?)").bind(name, body, seeds, thhMg).run();
  return redirectWithStatus(request, "/sacrament/", "ok");
};
