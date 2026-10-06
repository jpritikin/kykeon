export type Env = { DB: D1Database; TURNSTILE_SECRET: string };

export const redirectWithStatus = (request: Request, path: string, status: "ok" | "invalid") => {
  const url = new URL(path, request.url);
  url.searchParams.set("status", status);
  return Response.redirect(url, 303);
};
