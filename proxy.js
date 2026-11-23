import { HOME_MARKDOWN } from "./lib/agentContent";

export function proxy(request) {
  const acceptsMarkdown = (request.headers.get("accept") || "")
    .split(",")
    .some((mediaType) => mediaType.trim().split(";")[0].toLowerCase() === "text/markdown");

  if (!acceptsMarkdown) {
    return;
  }

  return new Response(HOME_MARKDOWN, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      Vary: "Accept",
    },
  });
}

export const config = {
  matcher: "/",
};
