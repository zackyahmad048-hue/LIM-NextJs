import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDate(date: Date | null) {
  return date ? dateFormatter.format(date) : "";
}

interface PostCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string | null;
    thumbnail: string | null;
    publishedAt: Date | null;
    category: { name: string; slug: string };
  };
  variant?: "default" | "glass";
}

export default function PostCard({ post, variant = "default" }: PostCardProps) {
  const glass = variant === "glass";

  return (
    <Link
      href={`/artikel/${post.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border transition-colors",
        glass
          ? "border-[var(--glass-border)] bg-[var(--glass-card-bg)] backdrop-blur-[var(--glass-blur)] backdrop-saturate-[var(--glass-saturate)] hover:border-primary/40"
          : "border-primary/15 bg-card hover:border-primary/40",
      )}
    >
      <div
        className={cn(
          "relative aspect-video overflow-hidden",
          !post.thumbnail && "bg-muted",
        )}
      >
        {post.thumbnail && (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2.5 text-[11px]">
          <span className="font-sans font-medium uppercase text-primary">
            {post.category.name}
          </span>
          <span aria-hidden className="h-0.5 w-0.5 rounded-full bg-muted-foreground/50" />
          <time dateTime={post.publishedAt?.toISOString()} className="tabular-nums text-muted-foreground">
            {formatDate(post.publishedAt)}
          </time>
        </div>

        <h3 className="mt-2.5 font-display text-base font-semibold text-balance leading-snug text-foreground transition-colors group-hover:text-primary">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="mt-2 line-clamp-3 text-xs leading-5 text-muted-foreground">
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
