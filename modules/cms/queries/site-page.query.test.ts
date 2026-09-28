import { describe, expect, it, vi, beforeEach } from "vitest";

import { getAboutContent } from "./site-page.query";
import { getPayloadClient } from "@/modules/cms/infrastructure/payload";

vi.mock("@/modules/cms/infrastructure/payload");

describe("getAboutContent", () => {
  let mockPayloadFind: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockPayloadFind = vi.fn();

    vi.mocked(getPayloadClient).mockResolvedValue({
      find: mockPayloadFind,
    } as any);
  });

  it("returns AboutContent from Payload when available", async () => {
    const payloadContent = {
      badge: "Custom Badge",
      title: "Custom Title",
      subtitle: "Custom Subtitle",
      description: "Custom Description",
      image: "/images/custom.jpg",
      features: [
        { title: "Feature 1", description: "Desc 1" },
        { title: "Feature 2", description: "Desc 2" },
      ],
    };

    mockPayloadFind.mockResolvedValue({
      docs: [{ content: payloadContent }],
    });

    const result = await getAboutContent();

    expect(result.badge).toBe("Custom Badge");
    expect(result.title).toBe("Custom Title");
    expect(result.subtitle).toBe("Custom Subtitle");
    expect(result.description).toBe("Custom Description");
    expect(result.image).toBe("/images/custom.jpg");
    expect(result.features).toEqual([
      { title: "Feature 1", description: "Desc 1" },
      { title: "Feature 2", description: "Desc 2" },
    ]);
  });

  it("returns defaults when Payload fails", async () => {
    mockPayloadFind.mockRejectedValue(new Error("Payload unavailable"));

    const result = await getAboutContent();

    expect(result.badge).toBe("Tentang Kami");
    expect(result.title).toBe("Lembaga Ittihadul Muballighin");
    expect(result.subtitle).toContain("Membangun generasi");
    expect(result.description).toContain("Lembaga Ittihadul Muballighin");
    expect(result.image).toBe("/images/iksadari.JPG");
    expect(result.features).toHaveLength(4);
  });

  it("returns defaults when Payload returns no docs", async () => {
    mockPayloadFind.mockResolvedValue({ docs: [] });

    const result = await getAboutContent();

    expect(result.badge).toBe("Tentang Kami");
    expect(result.features).toHaveLength(4);
  });

  it("returns defaults when Payload returns empty content object", async () => {
    mockPayloadFind.mockResolvedValue({ docs: [{ content: {} }] });

    const result = await getAboutContent();

    // Implementation uses field defaults when content is empty
    expect(result.badge).toBe("Tentang Kami");
    expect(result.title).toBe("Lembaga Ittihadul Muballighin");
    expect(result.subtitle).toContain("Membangun generasi");
    expect(result.description).toContain("Lembaga Ittihadul Muballighin");
    expect(result.image).toBe("/images/iksadari.JPG");
    expect(result.features).toHaveLength(4);
  });

  it("filters invalid features from Payload", async () => {
    const payloadContent = {
      features: [
        { title: "Valid Feature", description: "Valid Desc" },
        { title: "", description: "No title" },
        { title: "No desc", description: "" },
        { invalid: "object" },
        null,
        { title: "Also Valid", description: "Also Valid Desc" },
      ],
    };

    mockPayloadFind.mockResolvedValue({ docs: [{ content: payloadContent }] });

    const result = await getAboutContent();

    // Implementation keeps features where title OR description is truthy
    expect(result.features).toEqual([
      { title: "Valid Feature", description: "Valid Desc" },
      { title: "", description: "No title" },
      { title: "No desc", description: "" },
      { title: "Also Valid", description: "Also Valid Desc" },
    ]);
  });
});