<p align="center">
  <img src="assets/nizyo.png" alt="Mango - Orange Cat" width="600"/>
</p>

<h1 align="center">🍊 mango</h1>

<p align="center">
  <em>Fake data generator with a juicy twist — built for speed, simplicity, and fun.<br/>
  Inspired by the vibrant energy of orange cats.</em>
</p>

---

## ✨ Features

- 🐾 Fast fake data generation
- 🐾 Fully written in TypeScript
- 🐾 Simple and expressive API
- 🐾 Extensible and customizable
- 🐾 ESM + CJS support
- 🐾 Multi-locale (e.g., `en_US`, `pt_BR`)

---

## 📦 Installation

```bash
# npm (recommended lowercase scope)
npm install @catniplabs/mango

# or pnpm
pnpm add @catniplabs/mango
````

---

## 🚀 Usage

### Functional API (tree-shakeable)

```ts
import { fullName, email, pt_BR, en_US } from "@catniplabs/mango";
import { Random } from "@catniplabs/mango/core/random";

const rng = new Random(42); // seed for reproducibility

console.log(fullName(rng, pt_BR)); // e.g., "Laura Oliveira"
console.log(email(rng, en_US));    // e.g., "james.smith@example.com"
```

### Class-based API

```ts
import { Mango, pt_BR } from "@catniplabs/mango";

const mango = new Mango({ seed: 1337, locale: pt_BR });

console.log(mango.person.fullName()); // e.g., "Ana Souza"
console.log(mango.internet.email());  // e.g., "ana.souza@exemplo.com"
```

---

## 🌐 Browser (CDN)

You can use Mango directly in the browser via jsDelivr or unpkg. Since browsers don't resolve bare specifiers by default, either import by full URL to the ESM file or set up an import map.

### Option A — Direct URL (no import map)

Using jsDelivr:

```html
<script type="module">
  import { Mango, pt_BR, en_US } from "https://cdn.jsdelivr.net/npm/@catniplabs/mango@0.1.2/dist/index.mjs";

  const mango = new Mango({ seed: 1337, locale: pt_BR, fallbackLocale: en_US });
  console.log(mango.person.fullName());
  console.log(mango.internet.email());
  console.log(mango.address.full());
</script>
```

Using unpkg:

```html
<script type="module">
  import { Mango, pt_BR, en_US } from "https://unpkg.com/@catniplabs/mango@latest/dist/index.mjs";

  const mango = new Mango({ seed: 2025, locale: en_US, fallbackLocale: pt_BR });
  console.log(mango.commerce.productName());
  console.log(mango.phone.phone());
</script>
```

### Option B — Import map (use package name in imports)

```html
<script type="importmap">
{
  "imports": {
    "@catniplabs/mango": "https://cdn.jsdelivr.net/npm/@catniplabs/mango@0.1.2/dist/index.mjs"
  }
}
</script>
<script type="module">
  import { Mango, pt_BR } from "@catniplabs/mango";
  const mango = new Mango({ seed: 42, locale: pt_BR });
  document.body.innerText = mango.internet.email();
</script>
```

Notes:
- The CDN serves ESM with proper CORS headers, so it works in `<script type="module">`.
- We publish ESM (`.mjs`) and CJS (`.cjs`); for browsers, prefer the ESM URL.
- For deterministic results in the browser, use the `Mango` class’ `seed` option.

## 🧩 Scripts

These scripts are available in `package.json`:

```bash
# Development (watch mode)
pnpm dev

# Build (ESM + CJS + types)
pnpm build

# Type checking
pnpm typecheck

# Tests (CI mode) and watch mode
pnpm test
pnpm test:watch

# Lint and auto-fix (Biome)
pnpm lint
pnpm lint:fix

# Format code (Biome)
pnpm format

# Changesets (versioning & publish)
pnpm changeset

# Pre-publish check
pnpm prepublishOnly

# Prepare husky hooks
pnpm prepare
```

---

## 🗺️ Roadmap

> Prioritized to deliver a lightweight, realistic, extensible, and multi-environment library.

### 🎯 MVP (v0.1.x)

* [x] Core RNG with seed (reproducibility)
* [x] ESM + CJS + types (`.d.ts`) via `tsup`
* [x] Functional API (tree-shakeable) + optional class (`Mango`)
* [x] Initial locales: `en_US`, `pt_BR`
* [x] Basic generators: `person` (first/last/fullName), `internet.email`
* [x] Unit tests with `vitest` + V8 coverage
* [x] Lint/format with **Biome**
* [x] CI (build, typecheck, lint, test)

### 🔸 v0.2.x — Realism and coverage

* [x] Full `address` (street, number, city, state, ZIP/CEP per locale format)
* [x] `phone` (valid regional formats)
* [x] `date` (ranges and practical utilities)
* [x] `commerce` (product, price, category)
* [x] `helpers.multiple` / `generateMany` for batch generation
* [x] Configurable locale fallback (e.g., `pt_BR` → `en_US`)

### 🔶 v0.3.x — Extensibility and DX

* [ ] **Plugin** system (register third-party modules)
* [ ] Public types for `LocaleDefinition` and custom providers
* [ ] Optional CLI to generate example datasets (seed + amount)

### 🟠 v0.4.x — Quality and performance

* [ ] Benchmarks (Node and browser) and comparisons
* [ ] Optional lazy-import for locales (on-demand loading)
* [ ] Extended documentation with real-world examples and guides

### 🟧 v0.5.x — Data reliability

* [ ] Regional validations (e.g., ZIP/CEP, phone formats)
* [ ] Realistic correlations (area code matching city/state, etc.)
* [ ] Dataset reviewed with community contributions

### 🟩 v1.0.0 — Stable

* [ ] Frozen and documented API
* [ ] Documentation site with playground
* [ ] Migration guide (if needed)
* [ ] Versioning and support policy

---

## 📜 License
```
MIT License

Copyright (c) 2025 CatnipLabs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---
