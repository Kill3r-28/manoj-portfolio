import type { Handler, HandlerEvent } from "@netlify/functions";
import { getJson, setJson } from "./lib/store";

const headers = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

function json(statusCode: number, body: unknown) {
  return { statusCode, headers, body: JSON.stringify(body) };
}

function votersKey(slug: string) {
  return `upvote-voters:${slug}`;
}

export const handler: Handler = async (event: HandlerEvent) => {
  const slug = event.queryStringParameters?.slug?.trim();
  if (!slug || slug.length > 120) {
    return json(400, { error: "Invalid post slug." });
  }

  if (event.httpMethod === "GET") {
    const voters = (await getJson<string[]>(votersKey(slug))) ?? [];
    const voterId = event.queryStringParameters?.voterId?.trim();
    return json(200, {
      count: voters.length,
      voted: voterId ? voters.includes(voterId) : false,
    });
  }

  if (event.httpMethod === "POST") {
    let payload: { voterId?: string };
    try {
      payload = JSON.parse(event.body ?? "{}");
    } catch {
      return json(400, { error: "Invalid JSON body." });
    }

    const voterId = payload.voterId?.trim();
    if (!voterId || voterId.length > 64) {
      return json(400, { error: "Invalid voter id." });
    }

    const voters = (await getJson<string[]>(votersKey(slug))) ?? [];
    if (!voters.includes(voterId)) {
      voters.push(voterId);
      await setJson(votersKey(slug), voters);
    }

    return json(200, { count: voters.length, voted: true });
  }

  return json(405, { error: "Method not allowed." });
};
