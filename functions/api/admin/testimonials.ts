import { denialReason } from "../../lib/admin";
import type { Env } from "../../lib/respond";

const forbidden = (reason: string) => new Response(reason, { status: 403 });

const optionalNumber = (value: unknown, integer: boolean) => {
  const text = String(value ?? "").trim();
  if (!text) return null;
  const number = Number(text);
  const valid = Number.isFinite(number) && number >= 0 && number <= 100000 && (!integer || Number.isInteger(number));
  return valid ? number : NaN;
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const reason = await denialReason(request, env);
  if (reason) return forbidden(reason);
  const { results } = await env.DB.prepare(
    "SELECT id, name, body, seeds, thh_mg, approved FROM testimonials ORDER BY approved, created_at DESC",
  ).all();
  return Response.json(results);
};

export const onRequestPut: PagesFunction<Env> = async ({ request, env }) => {
  const reason = await denialReason(request, env);
  if (reason) return forbidden(reason);
  const entry = (await request.json()) as Record<string, unknown>;
  const body = String(entry.body ?? "").trim();
  const name = String(entry.name ?? "").trim().slice(0, 80) || null;
  const seeds = optionalNumber(entry.seeds, true);
  const thhMg = optionalNumber(entry.thh_mg, false);
  if (!body || body.length > 4000 || Number.isNaN(seeds) || Number.isNaN(thhMg)) {
    return new Response("Bad request", { status: 400 });
  }
  await env.DB.prepare("INSERT INTO testimonials (name, body, seeds, thh_mg) VALUES (?, ?, ?, ?)").bind(name, body, seeds, thhMg).run();
  return new Response(null, { status: 204 });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const reason = await denialReason(request, env);
  if (reason) return forbidden(reason);
  const { id, action } = (await request.json()) as { id: number; action: string };
  const statements: Record<string, string> = {
    approve: "UPDATE testimonials SET approved = 1 WHERE id = ?",
    unapprove: "UPDATE testimonials SET approved = 0 WHERE id = ?",
    delete: "DELETE FROM testimonials WHERE id = ?",
  };
  const sql = statements[action];
  if (!sql || !Number.isInteger(id)) return new Response("Bad request", { status: 400 });
  await env.DB.prepare(sql).bind(id).run();
  return new Response(null, { status: 204 });
};
