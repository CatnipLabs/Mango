# Changelog

## 0.5.0

### Minor Changes

- 38c52d3: Feature: New generator package.

## 0.4.1

### Patch Changes

- e3f15dc: Better Readme docs.

## 0.4.0

### Minor Changes

- 8d49511: Plugin Suppot.

## 0.3.0

### Minor Changes

- b945b70: Realism and coverage

All notable changes to this project will be documented in this file.

## [0.2.0] - 2025-08-15

### Added

- Address generator: `street`, `streetNumber`, `city`, `state`, `zip`, `fullAddress` with locale-specific formats (US ZIP, BR CEP).
- Phone generator: `phone` with regional formats (US, BR).
- Date utilities: `dateBetween`, `dateRecent`, `dateSoon` (and class API `mango.date.*`).
- Commerce: `category`, `productName`, `price`, `priceWithCurrency`.
- Helpers: `multiple`, `generateMany` for batch generation.
- Configurable locale fallback via `resolveLocale` and `Mango({ fallbackLocale })`.

### Changed

- Public API exports now include all new generators and helpers.
- `tsup` build config now emits ESM as `.mjs` and CJS as `.cjs` to align with package.json.

### Docs

- README roadmap updated to mark v0.2.x items as completed.

### Testing

- Added tests covering address, phone, date, commerce; all pass under Vitest.

---

Keepers:

- TS-first, tiny, deterministic via seed.
- ESM + CJS + types.

# @catniplabs/mango

## 0.1.1

### Patch Changes

- af759f2: First Alpha.
