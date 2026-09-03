interface AboutCardProps {
  title: string;
  description: string;
}

export default function AboutCard({ title, description }: AboutCardProps) {
  return (
    <div className="flex h-full gap-4 rounded-xl border border-primary/25 bg-card p-5 shadow-sm transition-colors duration-300 ease-out hover:border-primary motion-reduce:transition-none">
      <span
        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-primary/40"
        aria-hidden
      >
        <span className="h-2 w-2 rounded-full bg-primary" />
      </span>

      <div>
        <h3 className="font-heading text-base font-medium text-balance text-foreground">
          {title}
        </h3>

        <p className="mt-1.5 text-xs leading-5 text-pretty text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
