interface AboutCardProps {
  title: string;
  description: string;
}

export default function AboutCard({ title, description }: AboutCardProps) {
  return (
    <div className="glass glass-tint-sekretariat h-full rounded-xl border border-primary/25 p-5 shadow-sm transition-colors duration-300 ease-out hover:border-primary motion-reduce:transition-none">
      <h3 className="font-heading text-base font-medium text-balance text-foreground">
        {title}
      </h3>

      <p className="mt-1.5 text-xs leading-5 text-pretty text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
