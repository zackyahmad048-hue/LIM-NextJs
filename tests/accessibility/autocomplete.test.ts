import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

// Mirrors axe-core rule "autocomplete-valid" (WCAG 1.3.5 / ACT 73f2c2):
// form fields whose id/name matches a browser-recognized autofill token
// must declare an autocomplete attribute.
const SOURCE_DIRS = ["app", "components", "modules"];
const SKIP_DIRS = new Set(["node_modules", ".next", "dist", ".git"]);

const FIELD_TAG =
  /<(?:input|select|textarea|Input|Textarea|NativeSelect)\b[^>]*>/gi;

const RECOGNIZED_TOKEN =
  /^(?:email|password|username|name|phone|mobile|telephone|organization|company|address|city|state|zip|postal|country|url|website|fullname|fname|lname|nickname|given-name|family-name)$/i;

const HIDDEN = /\btype=["']hidden["']/i;
const AUTOCOMPLETE = /autocomplete|autoComplete|auto_complete/i;

function walk(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) {
      continue;
    }
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (entry.name.endsWith(".tsx")) {
      files.push(full);
    }
  }
  return files;
}

function recognizedFields(tag: string): string[] {
  const values: string[] = [];
  const patterns = [
    /name=["']([^"']+)["']/gi,
    /id=["']([^"']+)["']/gi,
    /register\(\s*["']([^"']+)["']/gi,
  ];
  for (const pattern of patterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(tag)) !== null) {
      values.push(match[1]);
    }
  }
  return values.filter((value) => RECOGNIZED_TOKEN.test(value));
}

function findViolations(file: string): string[] {
  const source = readFileSync(file, "utf8");
  const violations: string[] = [];
  let match: RegExpExecArray | null;
  const tagRe = new RegExp(FIELD_TAG.source, "gi");
  while ((match = tagRe.exec(source)) !== null) {
    const tag = match[0];
    if (HIDDEN.test(tag) || AUTOCOMPLETE.test(tag)) {
      continue;
    }
    const fields = recognizedFields(tag);
    if (fields.length > 0) {
      violations.push(`${fields.join(", ")} -> ${tag.replace(/\s+/g, " ")}`);
    }
  }
  return violations;
}

describe("form fields with browser-recognized names", () => {
  it("must declare an autocomplete attribute", () => {
    const violations: string[] = [];
    for (const dir of SOURCE_DIRS) {
      for (const file of walk(dir)) {
        for (const violation of findViolations(file)) {
          violations.push(`${relative(process.cwd(), file)}: ${violation}`);
        }
      }
    }
    expect(violations).toEqual([]);
  });
});
