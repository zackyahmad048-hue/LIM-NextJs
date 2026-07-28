interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  center?: boolean;
}

export default function SectionHeading({
  badge,
  title,
  description,
  center = true,
}: SectionHeadingProps) {
  return (
    <div className={'max-w-2xl ' + (center ? 'mx-auto text-center' : '')}>
      {badge && (
        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
          {badge}
        </span>
      )}

      <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        {title}
      </h2>

      {description && (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
