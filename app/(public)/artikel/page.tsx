import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/data/states'
import { listArticles } from '@/modules/cms/presentation/queries/list-articles.query'

export const metadata: Metadata = { title: 'Artikel' }

async function ArticleList() {
  const articles = await listArticles({ status: 'PUBLISHED' })
  if (articles.length === 0) {
    return <EmptyState title="Belum ada artikel" description="Artikel yang dipublikasikan akan tampil di sini." />
  }
  return (
    <div className="space-y-4">
      {articles.map((a) => (
        <article key={a.id} className="rounded-lg border bg-card p-4">
          <h2 className="font-medium"><Link href={`/artikel/${a.slug}`} className="hover:text-primary">{a.title}</Link></h2>
          {a.excerpt && <p className="mt-1 text-sm text-muted-foreground">{a.excerpt}</p>}
          <p className="mt-2 text-xs text-muted-foreground">{new Date(a.publishedAt ?? a.createdAt).toLocaleDateString('id-ID')}</p>
        </article>
      ))}
    </div>
  )
}

function ArticleSkeleton() {
  return <div className="h-24 animate-pulse rounded-lg bg-muted" />
}

export default function ArtikelPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader title="Artikel" description="Artikel dakwah dari LIM" />
      <div className="mt-6">
        <Suspense fallback={<ArticleSkeleton />}>
          <ArticleList />
        </Suspense>
      </div>
    </div>
  )
}
