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
  size?: "default" | "feature";
  className?: string;
}

export default function PostCard({
  post,
  size = "default",
  className,
}: PostCardProps) {
  const feature = size === "feature";

  return (
    <Link
      href={`/artikel/${post.slug}`}
      className={cn(
        "group glass glass-tint-konten flex flex-col overflow-hidden rounded-md border border-primary/25 transition-colors duration-300 ease-out hover:border-primary",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          feature ? "min-h-56 flex-1 sm:min-h-64" : "aspect-video",
          !post.thumbnail && "bg-muted",
        )}
      >
        {post.thumbnail && (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            sizes={
              feature
                ? "(min-width: 1024px) 50vw, 100vw"
                : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            }
            className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          />
        )}
      </div>

      <div className={cn("flex flex-col p-5", !feature && "flex-1")}>
        <div className="flex items-center gap-2.5 text-[11px]">
          <span className="font-sans font-medium uppercase tracking-wide text-primary">
            {post.category.name}
          </span>
          <span
            aria-hidden
            className="h-0.5 w-0.5 rounded-full bg-muted-foreground/50"
          />
          <time
            dateTime={post.publishedAt?.toISOString()}
            className="tabular-nums text-muted-foreground"
          >
            {formatDate(post.publishedAt)}
          </time>
        </div>

        <h3
          className={cn(
            "mt-2.5 font-heading font-semibold text-balance leading-snug text-foreground transition-colors group-hover:text-primary",
            feature ? "text-lg sm:text-xl" : "text-base",
          )}
        >
          {post.title}
        </h3>

        {post.excerpt && (
          <p
            className={cn(
              "mt-2 line-clamp-3 text-muted-foreground",
              feature ? "text-sm leading-6" : "text-xs leading-5",
            )}
          >
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
