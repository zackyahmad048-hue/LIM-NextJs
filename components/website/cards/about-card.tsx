interface AboutCardProps {
  title: string;
  description: string;
}

export default function AboutCard({ title, description }: AboutCardProps) {
  return (
    <div className="glass glass-tint-sekretariat rounded-xl border border-primary/25 p-6 shadow-sm">
      <span
        className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-primary/40"
        aria-hidden
      >
        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
      </span>

      <div>
        <h3 className="font-heading text-base font-medium text-balance text-foreground">
          {title}
        </h3>

        <p className="mt-2 text-xs leading-5 text-pretty text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
