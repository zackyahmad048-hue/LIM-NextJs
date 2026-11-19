import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { EmptyState } from '@/components/data/states'
import { listPublishedArticles } from '@/modules/cms/presentation/queries/list-articles.query'

export const metadata: Metadata = { title: 'Artikel' }

async function ArticleList() {
  const articles = await listPublishedArticles()
  if (articles.length === 0) {
    return <EmptyState title="Belum ada artikel" description="Artikel yang dipublikasikan akan tampil di sini." />
  }
  return (
    <ul className="divide-y divide-border border-y border-border">
      {articles.map((a) => {
        const tanggal = new Date(a.publishedAt ?? a.createdAt)
        return (
          <li key={a.id}>
            <article className="grid gap-1 py-6 sm:grid-cols-[9rem_1fr] sm:gap-8">
              <time dateTime={tanggal.toISOString()} className="text-sm text-muted-foreground sm:pt-1">
                {tanggal.toLocaleDateString('id-ID', { dateStyle: 'long' })}
              </time>
              <div>
                <h2 className="text-xl leading-snug font-semibold text-balance">
                  <Link
                    href={`/artikel/${a.slug}`}
                    className="underline-offset-4 outline-none hover:underline focus-visible:underline"
                  >
                    {a.title}
                  </Link>
                </h2>
                {a.excerpt && (
                  <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">{a.excerpt}</p>
                )}
              </div>
            </article>
          </li>
        )
      })}
    </ul>
  )
}

function ArticleSkeleton() {
  return (
    <div aria-hidden className="divide-y divide-border border-y border-border">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="grid gap-2 py-6 sm:grid-cols-[9rem_1fr] sm:gap-8">
          <div className="h-4 w-28 animate-pulse rounded bg-muted" />
          <div className="space-y-2">
            <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ArtikelPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Artikel</h1>
      <p className="mt-3 text-lg text-muted-foreground">Artikel dakwah dari LIM</p>
      <div className="mt-10">
        <Suspense fallback={<ArticleSkeleton />}>
          <ArticleList />
        </Suspense>
      </div>
    </div>
  )
}
