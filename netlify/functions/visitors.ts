import type { Handler, HandlerEvent } from "@netlify/functions";
import { getJson, setJson } from "./lib/store";
import { isOwnerRequest } from "./lib/owner";

const VISITOR_KEY = "meta:site-visitors";

const headers = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

function json(statusCode: number, body: unknown) {
  return { statusCode, headers, body: JSON.stringify(body) };
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === "GET") {
    const data = (await getJson<{ count: number }>(VISITOR_KEY)) ?? { count: 0 };
    return json(200, {
      count: data.count,
      isOwner: isOwnerRequest(event),
    });
  }

  if (event.httpMethod === "POST") {
    if (isOwnerRequest(event)) {
      const data = (await getJson<{ count: number }>(VISITOR_KEY)) ?? { count: 0 };
      return json(200, { count: data.count, skipped: true });
    }

    const data = (await getJson<{ count: number }>(VISITOR_KEY)) ?? { count: 0 };
    data.count += 1;
    await setJson(VISITOR_KEY, data);
    return json(200, { count: data.count });
  }

  return json(405, { error: "Method not allowed" });
};
