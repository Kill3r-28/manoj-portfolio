import type { Handler, HandlerEvent } from "@netlify/functions";
import { getBlobStore, getJson, setJson } from "./lib/store";
import { isOwnerRequest } from "./lib/owner";

interface Comment {
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
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  if (!isOwnerRequest(event)) {
    return json(401, { error: "Unauthorized" });
  }

  let body: { action?: string; slug?: string; id?: string };
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  if (body.action === "listComments") {
    try {
      const store = getBlobStore();
      const { blobs } = await store.list({ prefix: "comments:" });
      const posts: { slug: string; comments: Comment[] }[] = [];

      for (const b of blobs) {
        const slug = b.key.startsWith("comments:")
          ? b.key.slice("comments:".length)
          : b.key;
        const comments = (await getJson<Comment[]>(commentKey(slug))) ?? [];
        posts.push({ slug, comments });
      }

      posts.sort((a, b) => a.slug.localeCompare(b.slug));
      return json(200, { posts });
    } catch (e) {
      console.error("listComments", e);
      return json(500, { error: "Failed to list comments" });
    }
  }

  if (body.action === "deleteComment") {
    const slug = body.slug?.trim();
    const id = body.id?.trim();
    if (!slug || !id) {
      return json(400, { error: "slug and id required" });
    }

    const comments = (await getJson<Comment[]>(commentKey(slug))) ?? [];
    const next = comments.filter((c) => c.id !== id);
    if (next.length === comments.length) {
      return json(404, { error: "Comment not found" });
    }
    await setJson(commentKey(slug), next);
    return json(200, { ok: true });
  }

  return json(400, { error: "Unknown action" });
};
