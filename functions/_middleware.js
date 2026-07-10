export async function onRequest(context) {
  const { request, env } = context;
  const PASSWORD = env.SITE_PASSWORD;

  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Basic ")) {
    const decoded = atob(authHeader.slice(6));
    const [, pass] = decoded.split(":");
    if (pass === PASSWORD) {
      return context.next();
    }
  }

  return new Response("Password required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Terra Rank"' },
  });
}
