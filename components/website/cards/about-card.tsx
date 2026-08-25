interface AboutCardProps {
  title: string;
  description: string;
}

export default function AboutCard({ title, description }: AboutCardProps) {
  return (
    <div className="flex h-full gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/45 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <span
        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10"
        aria-hidden
      >
        <span className="h-2 w-2 rounded-full bg-primary" />
      </span>

      <div>
        <h3 className="font-display text-base font-medium text-balance text-foreground">
          {title}
        </h3>

        <p className="mt-1.5 text-xs leading-5 text-pretty text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
