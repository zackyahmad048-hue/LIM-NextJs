interface AboutCardProps {
  title: string;
  description: string;
}

export default function AboutCard({ title, description }: AboutCardProps) {
  return (
    <div className="group flex gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/35">
      <span
        className="mt-1.5 block h-2 w-2 shrink-0 bg-primary"
        aria-hidden
      />

      <div>
        <h3 className="font-display text-base font-medium text-balance text-foreground">
          {title}
        </h3>

        <p className="mt-1.5 text-xs leading-5 text-pretty text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
