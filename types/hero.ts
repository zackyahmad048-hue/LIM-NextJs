export interface HeroStatCard {
  value: string;
  label: string;
}

export interface HeroConfig {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  statCards: HeroStatCard[];
}
