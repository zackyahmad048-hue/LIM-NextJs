"use server";

import { FALAK_TOOLS } from "@/config/falak";
import { getPublicMedia } from "@/modules/cms/queries/media.query";
import { getPaginatedPosts } from "@/modules/cms/queries/post.query";
import {
  humanizeFileName,
  MEDIA_TYPE_LABELS,
} from "@/lib/media";
import {
  EMPTY_SEARCH_RESULT,
  type SiteSearchResult,
} from "@/modules/cms/presentation/site-search.types";

const MAX_QUERY_LENGTH = 80;

function normalizeQuery(q: string) {
  return q.trim().toLowerCase().replace(/\s+/g, " ");
}

export async function searchSite(q: string): Promise<SiteSearchResult> {
  const query = normalizeQuery(q);

  if (!query || query.length > MAX_QUERY_LENGTH) {
    return EMPTY_SEARCH_RESULT;
  }

  const [paginated, mediaItems] = await Promise.all([
    getPaginatedPosts({
      status: "published",
      page: 1,
      limit: 5,
      search: query,
    }),
    getPublicMedia(),
  ]);

  const posts = paginated.posts.map((post) => ({
    title: post.title,
    href: `/artikel/${post.slug}`,
    meta: post.category ? post.category.name : "Artikel",
  }));

  const media = mediaItems
    .filter((item) => {
      const rawName = normalizeQuery(item.name);
      const displayName = normalizeQuery(humanizeFileName(item.name));

      return displayName.includes(query) || rawName.includes(query);
    })
    .slice(0, 6)
    .map((item) => ({
      title: humanizeFileName(item.name),
      href: item.href,
      meta: `${MEDIA_TYPE_LABELS[item.type]} — ${item.size}`,
    }));

  const falak = FALAK_TOOLS.filter(
    (tool) =>
      normalizeQuery(tool.title).includes(query) ||
      normalizeQuery(tool.description).includes(query),
  ).map((tool) => ({
    title: tool.title,
    href: tool.href,
    meta: "Layanan Falak",
  }));

  return { posts, media, falak };
}