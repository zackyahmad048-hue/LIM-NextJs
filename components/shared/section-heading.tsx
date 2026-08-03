interface SectionHeadingProps {
  title: string;
  description?: string;
  center?: boolean;
}

export default function SectionHeading({
  title,
  description,
  center = true,
}: SectionHeadingProps) {
  return (
    <div className={"max-w-2xl " + (center ? "mx-auto text-center" : "")}>
      <h2
        className={
          "font-display text-3xl font-semibold text-foreground md:text-4xl " +
          (center ? "" : "max-w-2xl")
        }
      >
        {title}
      </h2>

      {description && (
        <p
          className={
            "mt-4 text-sm leading-7 text-muted-foreground md:text-base " +
            (center ? "mx-auto" : "max-w-2xl")
          }
        >
          {description}
        </p>
      )}
    </div>
  );
}
