import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getPublishedArticleBySlug } from '@/modules/cms/presentation/queries/get-article-by-slug.query'

async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const article = await getPublishedArticleBySlug(decodeURIComponent((await params).slug))
  if (!article) notFound()
  return (
    <article>
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{article.title}</h1>
      {article.excerpt && <p className="mt-2 text-muted-foreground">{article.excerpt}</p>}
      {article.publishedAt && (
        <p className="mt-2 text-xs text-muted-foreground">
          {new Date(article.publishedAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}
        </p>
      )}
      {/* shortcut: konten dirender sebagai teks polos — saat rich text editor aktif, sanitasi DOMPurify dulu */}
      <div className="mt-6 whitespace-pre-wrap text-sm leading-relaxed">{article.content}</div>
    </article>
  )
}

export default function ArtikelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-muted" />}>
        <Article params={params} />
      </Suspense>
    </div>
  )
}
