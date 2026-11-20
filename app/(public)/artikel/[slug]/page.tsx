import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getPublishedArticleBySlug } from '@/modules/cms/presentation/queries/get-article-by-slug.query'

async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const article = await getPublishedArticleBySlug((await params).slug)
  if (!article) notFound()
  return (
    <article>
      <h1 className="text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">{article.title}</h1>
      {article.excerpt && <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{article.excerpt}</p>}
      {article.publishedAt && (
        <time
          dateTime={new Date(article.publishedAt).toISOString()}
          className="mt-4 block text-sm text-muted-foreground"
        >
          {new Date(article.publishedAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}
        </time>
      )}
      {/* shortcut: konten dirender sebagai teks polos — saat rich text editor aktif, sanitasi DOMPurify dulu */}
      <div className="mt-10 max-w-prose border-t border-border pt-8 text-base leading-8 whitespace-pre-wrap">
        {article.content}
      </div>
    </article>
  )
}

export default function ArtikelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <Link
        href="/artikel"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Semua artikel
      </Link>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <Article params={params} />
      </Suspense>
    </div>
  )
}
