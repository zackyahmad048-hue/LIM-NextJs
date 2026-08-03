interface AboutCardProps {
  title: string;
  description: string;
}

export default function AboutCard({ title, description }: AboutCardProps) {
  return (
    <div className="group flex gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/30 hover:shadow-md">
      <span
        className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
        aria-hidden
      />

      <div>
        <h3 className="font-display text-base font-semibold text-foreground">
          {title}
        </h3>

        <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
