import { describe, expect, it, vi, beforeEach } from "vitest";

import { getHeroConfig } from "./hero.query";
import { DEFAULT_HERO_CONFIG } from "@/config/hero";

vi.mock("@/modules/cms/infrastructure/payload");

import { getPayloadClient } from "@/modules/cms/infrastructure/payload";

describe("getHeroConfig", () => {
  let mockPayloadFindGlobal: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockPayloadFindGlobal = vi.fn();

    vi.mocked(getPayloadClient).mockResolvedValue({
      findGlobal: mockPayloadFindGlobal,
    } as any);
  });

  it("returns Payload hero config when available and valid", async () => {
    const payloadHero = {
      title: "Payload Title",
      highlight: "Payload Highlight",
      description: "Payload Description",
      image: "/images/payload.jpg",
      ctaLabel: "Payload CTA",
      ctaHref: "/payload-cta",
      secondaryLabel: "Payload Secondary",
      secondaryHref: "/payload-secondary",
      eyebrow: "Payload Eyebrow",
      tagline: "Payload Tagline",
      statCards: [{ value: "10", label: "Test" }],
    };

    mockPayloadFindGlobal.mockResolvedValue({ hero: payloadHero });

    const result = await getHeroConfig();

    expect(result.title).toBe("Payload Title");
    expect(result.highlight).toBe("Payload Highlight");
    expect(result.description).toBe("Payload Description");
    expect(result.image).toBe("/images/payload.jpg");
    expect(result.statCards).toEqual([{ value: "10", label: "Test" }]);
  });

  it("returns DEFAULT_HERO_CONFIG when Payload fails", async () => {
    mockPayloadFindGlobal.mockRejectedValue(new Error("Payload unavailable"));

    const result = await getHeroConfig();

    expect(result).toEqual(DEFAULT_HERO_CONFIG);
  });

  it("returns DEFAULT_HERO_CONFIG when Payload returns empty hero", async () => {
    mockPayloadFindGlobal.mockResolvedValue({ hero: null });

    const result = await getHeroConfig();

    expect(result).toEqual(DEFAULT_HERO_CONFIG);
  });

  it("returns DEFAULT_HERO_CONFIG when Payload hero has no signal", async () => {
    mockPayloadFindGlobal.mockResolvedValue({
      hero: { title: "", highlight: "", description: "" },
    });

    const result = await getHeroConfig();

    expect(result).toEqual(DEFAULT_HERO_CONFIG);
  });

  it("uses fallback values for missing Payload fields", async () => {
    const partialPayloadHero = {
      title: "Only Title",
      highlight: "",
      description: "",
      image: "",
      ctaLabel: "",
      ctaHref: "",
      secondaryLabel: "",
      secondaryHref: "",
      eyebrow: "",
    };

    mockPayloadFindGlobal.mockResolvedValue({ hero: partialPayloadHero });

    const result = await getHeroConfig();

    expect(result.title).toBe("Only Title");
    expect(result.highlight).toBe(DEFAULT_HERO_CONFIG.highlight);
    expect(result.description).toBe(DEFAULT_HERO_CONFIG.description);
    expect(result.image).toBe(DEFAULT_HERO_CONFIG.image);
    expect(result.ctaLabel).toBe(DEFAULT_HERO_CONFIG.ctaLabel);
    expect(result.ctaHref).toBe(DEFAULT_HERO_CONFIG.ctaHref);
  });

  it("filters out invalid statCards from Payload", async () => {
    const payloadHero = {
      title: "Test",
      highlight: "Test",
      description: "Test",
      image: "/test.jpg",
      ctaLabel: "CTA",
      ctaHref: "/cta",
      secondaryLabel: "Secondary",
      secondaryHref: "/secondary",
      eyebrow: "Eyebrow",
      statCards: [
        { value: "100", label: "Valid" },
        { value: "", label: "No value" },
        { value: "200", label: "" },
        { invalid: "object" },
        null,
        { value: "300", label: "Also valid" },
      ],
    };

    mockPayloadFindGlobal.mockResolvedValue({ hero: payloadHero });

    const result = await getHeroConfig();

    // Implementation keeps cards where value OR label is truthy
    expect(result.statCards).toEqual([
      { value: "100", label: "Valid" },
      { value: "", label: "No value" },
      { value: "200", label: "" },
      { value: "300", label: "Also valid" },
    ]);
  });

  it("uses DEFAULT_HERO_CONFIG statCards when Payload statCards are all invalid", async () => {
    const payloadHero = {
      title: "Test",
      highlight: "Test",
      description: "Test",
      image: "/test.jpg",
      ctaLabel: "CTA",
      ctaHref: "/cta",
      secondaryLabel: "Secondary",
      secondaryHref: "/secondary",
      eyebrow: "Eyebrow",
      statCards: [
        { value: "", label: "" },
        null,
        { invalid: true },
      ],
    };

    mockPayloadFindGlobal.mockResolvedValue({ hero: payloadHero });

    const result = await getHeroConfig();

    expect(result.statCards).toEqual(DEFAULT_HERO_CONFIG.statCards);
  });
});
