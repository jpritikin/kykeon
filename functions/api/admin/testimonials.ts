import { denialReason } from "../../lib/admin";
import type { Env } from "../../lib/respond";

const forbidden = (reason: string) => new Response(reason, { status: 403 });

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const reason = await denialReason(request, env);
  if (reason) return forbidden(reason);
  const { results } = await env.DB.prepare(
    "SELECT id, name, body, approved FROM testimonials ORDER BY approved, created_at DESC",
  ).all();
  return Response.json(results);
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
