export async function onRequest(context) {
  const password = context.env.SITE_PASSWORD;

  // No password set = site stays public
  if (!password) {
    return context.next();
  }

  const authorization = context.request.headers.get("Authorization");

  if (authorization) {
    const [scheme, encoded] = authorization.split(" ");

    if (scheme === "Basic" && encoded) {
      const decoded = atob(encoded);
      const separatorIndex = decoded.indexOf(":");

      const enteredPassword =
        separatorIndex >= 0 ? decoded.slice(separatorIndex + 1) : "";

      if (enteredPassword === password) {
        return context.next();
      }
    }
  }

  return new Response("Password required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Terra Rank"',
    },
  });
}
