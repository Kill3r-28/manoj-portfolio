import type { Handler, HandlerEvent } from "@netlify/functions";
import { getJson, setJson } from "./lib/store";

export interface Comment {
  id: string;
  name: string;
  body: string;
  createdAt: string;
}

const headers = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

function json(statusCode: number, body: unknown) {
  return { statusCode, headers, body: JSON.stringify(body) };
}

function commentKey(slug: string) {
  return `comments:${slug}`;
}

export const handler: Handler = async (event: HandlerEvent) => {
  const slug = event.queryStringParameters?.slug?.trim();
  if (!slug || slug.length > 120) {
    return json(400, { error: "Invalid post slug." });
  }

  if (event.httpMethod === "GET") {
    const comments = (await getJson<Comment[]>(commentKey(slug))) ?? [];
    return json(200, { comments });
  }

  if (event.httpMethod === "POST") {
    let payload: { name?: string; body?: string; website?: string };
    try {
      payload = JSON.parse(event.body ?? "{}");
    } catch {
      return json(400, { error: "Invalid JSON body." });
    }

    if (payload.website?.trim()) {
      return json(200, { ok: true });
    }

    const name = payload.name?.trim() ?? "";
    const body = payload.body?.trim() ?? "";

    if (!name || !body) {
      return json(400, { error: "Name and comment are required." });
    }
    if (name.length > 80) {
      return json(400, { error: "Name is too long (max 80 characters)." });
    }
    if (body.length > 2000) {
      return json(400, { error: "Comment is too long (max 2000 characters)." });
    }

    const comments = (await getJson<Comment[]>(commentKey(slug))) ?? [];
    const comment: Comment = {
      id: crypto.randomUUID(),
      name,
      body,
      createdAt: new Date().toISOString(),
    };
    comments.push(comment);
    await setJson(commentKey(slug), comments);

    return json(201, { comment });
  }

  return json(405, { error: "Method not allowed." });
};
