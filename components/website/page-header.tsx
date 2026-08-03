interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <header className="relative">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
        <h1 className="max-w-3xl font-display text-[2rem] font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          {title}
        </h1>

        {description && (
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            {description}
          </p>
        )}

        {children && <div className="mt-8">{children}</div>}
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="h-px bg-border" aria-hidden />
      </div>
    </header>
  );
}
