import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "font-sans text-[11px] font-medium uppercase tracking-[0.3em] text-primary",
        className,
      )}
    >
      {children}
    </p>
  );
}
