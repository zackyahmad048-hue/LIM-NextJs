# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> login page renders
- Location: e2e/auth.spec.ts:3:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[type=email], input[name=email]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('input[type=email], input[name=email]') with timeout 5000ms
  - waiting for locator('input[type=email], input[name=email]')

```

```yaml
- heading "404" [level=1]
- heading "This page could not be found." [level=2]
- alert
```

# Test source

```ts
  1 | import { test, expect } from '@playwright/test'
  2 | 
  3 | test('login page renders', async ({ page }) => {
  4 |   await page.goto('/login')
> 5 |   await expect(page.locator('input[type=email], input[name=email]')).toBeVisible()
    |                                                                      ^ Error: expect(locator).toBeVisible() failed
  6 | })
```