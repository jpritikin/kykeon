import type { Env } from "../lib/respond";

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.DB.prepare(
    "SELECT name, body FROM testimonials WHERE approved = 1 ORDER BY created_at DESC LIMIT 20",
  ).all();
  return Response.json(results, { headers: { "Cache-Control": "public, max-age=300" } });
};
