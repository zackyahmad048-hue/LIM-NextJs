import { functionBaseUrl } from "@neon/env";

export async function GET() {
  const url = functionBaseUrl("hello");
  const response = await fetch(url, { cache: "no-store" });
  const body = await response.text();
  if (!response.ok) {
    return Response.json({ error: `Neon Function returned ${response.status}: ${body}` }, { status: 502 });
  }
  return Response.json({ message: `Function responded: ${body}` });
}
