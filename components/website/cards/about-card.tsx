import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AboutCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function AboutCard({ title, description, icon: Icon }: AboutCardProps) {
  return (
    <Card className="group/card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardContent className="p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary duration-300 group-hover/card:scale-110 group-hover/card:bg-primary group-hover/card:text-primary-foreground">
          <Icon size={18} />
        </div>

        <h3 className="mt-3 text-base font-bold text-foreground">
          {title}
        </h3>

        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          {description}
        </p>

        <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-all group-hover/card:gap-2.5">
          Selengkapnya
          <ArrowRight size={14} />
        </div>
      </CardContent>
    </Card>
  );
}
