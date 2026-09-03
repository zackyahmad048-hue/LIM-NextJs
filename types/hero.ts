export interface HeroStatCard {
  value: string;
  label: string;
}

export interface HeroConfig {
  eyebrow: string;
  title: string;
  highlight: string;
  /** Tagline unggulan (moto organisasi). Opsional untuk kompatibilitas konfigurasi lama. */
  tagline?: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  statCards: HeroStatCard[];
}
