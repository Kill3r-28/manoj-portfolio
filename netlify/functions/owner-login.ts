import type { Handler, HandlerEvent } from "@netlify/functions";
import { ownerSetCookieHeader } from "./lib/owner";

const plain = { "Content-Type": "text/plain; charset=utf-8" };

export const handler: Handler = async (event: HandlerEvent) => {
  const ownerSecret = process.env.PORTFOLIO_OWNER_SECRET;
  if (!ownerSecret) {
    return {
      statusCode: 503,
      headers: plain,
      body: "PORTFOLIO_OWNER_SECRET is not configured on Netlify.",
    };
  }

  if (event.httpMethod !== "GET") {
    return { statusCode: 405, headers: plain, body: "Method not allowed" };
  }

  const provided = event.queryStringParameters?.owner?.trim();
  if (!provided || provided !== ownerSecret) {
    return {
      statusCode: 401,
      headers: plain,
      body: "Unauthorized",
    };
  }

  let redirect = event.queryStringParameters?.redirect?.trim() || "/";
  if (!redirect.startsWith("/") || redirect.startsWith("//")) {
    redirect = "/";
  }

  return {
    statusCode: 302,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      Location: redirect,
      "Set-Cookie": ownerSetCookieHeader(ownerSecret),
    },
    body: "",
  };
};
