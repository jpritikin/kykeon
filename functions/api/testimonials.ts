import type { Env } from "../lib/respond";

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const id = Number(new URL(request.url).searchParams.get("id")) || null;
  const { results } = await env.DB.prepare(
    `SELECT id, name, body, seeds, thh_mg FROM testimonials
     WHERE approved = 1 AND (id = ?1 OR id IN (SELECT id FROM testimonials WHERE approved = 1 ORDER BY created_at DESC LIMIT 20))
     ORDER BY created_at DESC`,
  ).bind(id).all();
  return Response.json(results, { headers: { "Cache-Control": "public, max-age=300" } });
};
