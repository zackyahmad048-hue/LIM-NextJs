import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getPublishedPostBySlug } from "@/modules/cms";

export const revalidate = 3600;

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

interface ArtikelDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArtikelDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return { title: "Artikel | LIM Digital Platform" };
  }

  return {
    title: `${post.title} | LIM Digital Platform`,
    description: post.excerpt ?? undefined,
  };
}

export default async function ArtikelDetailPage({
  params,
}: ArtikelDetailProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Beranda</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/artikel">Artikel</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{post.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Link
        href="/artikel"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Kembali ke Artikel
      </Link>

      <header className="mt-5">
        <div className="flex items-center gap-2.5 text-xs">
          <span className="font-sans font-medium uppercase tracking-[0.18em] text-primary">
            {post.category.name}
          </span>
          <span aria-hidden className="h-0.5 w-0.5 rounded-full bg-muted-foreground/50" />
          <time
            dateTime={post.publishedAt?.toISOString()}
            className="text-muted-foreground"
          >
            {post.publishedAt ? dateFormatter.format(post.publishedAt) : ""}
          </time>
        </div>

        <h1 className="mt-4 font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            {post.excerpt}
          </p>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          Oleh{" "}
          <span className="font-medium text-foreground">
            {post.author.name}
          </span>
        </p>
      </header>

      {post.thumbnail && (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl border border-border/10">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-8 whitespace-pre-wrap border-t border-border/10 pt-8 text-[15px] leading-8 text-foreground/90">
        {post.content}
      </div>
    </article>
  );
}
