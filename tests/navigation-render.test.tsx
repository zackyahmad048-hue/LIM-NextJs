/**
 * @vitest-environment jsdom
 *
 * Loop render — integritas navigasi publik (regresi navigation-motion).
 *
 * Mengunci dua defek yang pernah lolos ke repo:
 *   1. Pencarian desktop  — palet dibungkus `{open && ...}` milik Sheet mobile,
 *      sehingga tombol "Cari" tidak pernah ada di viewport desktop.
 *   2. Integritas render   — console.error React (validateDOMNesting, hydration
 *      mismatch, duplikasi layoutId) wajib nihil saat chrome dirender.
 *
 * Jalankan: npx vitest run tests/navigation-render.test.tsx
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { createElement } from "react";

const pathname = "/artikel";
const push = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
  useRouter: () => ({
    push,
    replace: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // next/image butuh runtime Next; di jsdom cukup <img> polos.
    const { alt, src } = props;
    return createElement("img", { alt: String(alt ?? ""), src: String(src ?? "") });
  },
}));

// vi.mock di atas di-hoist Vitest sebelum import statis ini.
import Navbar from "@/components/website/layout/navbar";

const REACT_ERROR_PATTERNS = [
  /validateDOMNesting/i,
  /Hydration (failed|did not match)/i,
  /unique ["']layoutId["']/i,
  /Text content does not match/i,
];

describe("<Navbar /> render integrity", () => {
  const consoleErrors: string[] = [];
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrors.length = 0;
    errorSpy = vi.spyOn(console, "error").mockImplementation((...args) => {
      consoleErrors.push(args.map(String).join(" "));
    });

    // jsdom tidak menyediakan API browser yang dipakai radix/motion.
    window.matchMedia =
      window.matchMedia ??
      ((query: string) =>
        ({
          matches: false,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }) as MediaQueryList);

    class ObserverStub {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    }
    vi.stubGlobal("ResizeObserver", ObserverStub);
    vi.stubGlobal("IntersectionObserver", ObserverStub);

    Element.prototype.scrollIntoView = Element.prototype.scrollIntoView ?? (() => {});
    Element.prototype.hasPointerCapture = Element.prototype.hasPointerCapture ?? (() => false);
    Element.prototype.setPointerCapture = Element.prototype.setPointerCapture ?? (() => {});
    Element.prototype.releasePointerCapture =
      Element.prototype.releasePointerCapture ?? (() => {});
  });

  afterEach(() => {
    cleanup();
    errorSpy.mockRestore();
    vi.unstubAllGlobals();
  });

  it("menampilkan pemicu pencarian di desktop (tanpa membuka Sheet mobile)", () => {
    render(<Navbar />);

    const trigger = screen.getByRole("button", { name: /cari di seluruh situs/i });
    expect(trigger).toBeTruthy();
    // Pemicu milik palet, bukan tombol buka menu mobile.
    expect(trigger.closest("[data-slot='sheet-content']")).toBeNull();
  });

  it("merender chrome tanpa error React (nesting, hydration, layoutId)", () => {
    render(<Navbar />);

    const reactErrors = consoleErrors.filter((msg) =>
      REACT_ERROR_PATTERNS.some((pattern) => pattern.test(msg)),
    );
    expect(reactErrors).toEqual([]);
  });
});
