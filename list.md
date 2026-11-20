# LabelLens – File-by-file efficiency review

Scope: every tracked/source file in the workspace (excluding generated/vendor/cache directories: `.git/`, `labellens-ui/node_modules/`, `labellens-ui/dist/`, `labellens-ui/.vercel/`, `labellens/__pycache__/`, `labellens/ui/__pycache__/`, `labellens/tests/__pycache__/`, `.pytest_cache/`, `node_modules/.vite/`, `node_modules/.tmp/`). Generated/runtime artifacts that are present in the repo are still reviewed below.

## Cross-cutting efficiency opportunities
- **Single source of truth for product/knowledge data:** catalog and ingredient knowledge are duplicated across `labellens-ui/src/lib/database.ts`, `labellens-ui/src/lib/knowledge.ts`, `labellens-ui/public/data/catalog.json`, `labellens-ui/public/data/knowledge.json`, and `labellens/data/*.json` (plus Python constants). This increases bundle size, parse time, sync bugs, and maintenance cost. Prefer generating TS/JSON/Python artifacts from one canonical dataset at build time or loading one shared JSON asset lazily.
- **Index hot lookup data once:** many barcode/id/name lookups use repeated linear `.find()`/loops over large arrays. Build `Map`s (by barcode, unpadded barcode, alias, id, lowercase name/brand) once at module init or on first data load for O(1) access.
- **Avoid per-call allocations in scanners/lookups:** camera and barcode paths recreate detectors, canvases, contexts, regex work, and normalized strings frequently. Reuse buffers/instances where safe and pre-normalize static data.
- **Bundle & offline tradeoffs (UI):** Google Fonts in `index.html`, large inline catalog in TS, and possibly unused deps (`zustand`, `motion`, `qrcode`) affect first load and install/build time. For a kiosk/offline app, prefer local fonts and lazy-load heavy datasets on demand.
- **Do not commit runtime artifacts:** `labellens/scan_history.db`, caches, and local env folders bloat the repo and slow clones/checkouts; keep them gitignored and generated locally.

---

## Repository root

### `.gitignore`
- **Purpose:** Ignore rules for dependencies, builds, Python caches, DBs, env/editor/OS files.
- **Efficiency fixes:**
  - Deduplicate/align with `labellens-ui/.gitignore` (e.g. `dist`, `node_modules`, `.vercel`, logs) to avoid drift and accidental commits.
  - Add missing generated/local paths if applicable: `.venv/`, `venv/`, `*.egg-info/`, coverage outputs, `labellens-ui/.vite/` (if ever created outside `node_modules`), and explicit `pnpm-debug.log*` already covered but ensure consistency.
  - Ignoring `*.db` globally is good, but `labellens/scan_history.db` is currently tracked/committed—remove it from git history/index so the rule takes effect and repo size stops growing.

### `README.md`
- **Purpose:** Top-level project overview and run instructions for both `labellens-ui` and `labellens` apps.
- **Efficiency fixes:**
  - Keep commands/ports/model names in one authoritative place (or link to app READMEs) to reduce doc drift and rework; currently overlaps with `labellens/README.md` and `labellens-ui/README.md`.
  - Add a short “data pipeline / regenerate catalog” note if datasets are generated, preventing manual duplicated edits.
  - Minor: include prerequisites (Node/pnpm/Python/Ollama versions) once to cut setup/debug time.

### `vercel.json`
- **Purpose:** Root Vercel build/install config (`cd labellens-ui && pnpm install/build`, output `labellens-ui/dist`).
- **Efficiency fixes:**
  - Consider enabling/building with a frozen lockfile in CI (`pnpm install --frozen-lockfile`) for reproducible, faster, cache-friendly installs (configured at platform/command level if desired).
  - If root and `labellens-ui/vercel.json` are both used, consolidate to one config to avoid conflicting deploy behavior and redundant maintenance.

### `.commandcode/settings.json`
- **Purpose:** Local tool/permission settings for Command Code in this workspace.
- **Efficiency fixes:**
  - Keep minimal; avoid storing environment-specific noise in repo if shared. No runtime impact.
  - If committed intentionally, document why; otherwise gitignore local agent state to reduce churn.

### `.commandcode/taste/taste.md`
- **Purpose:** Project taste/preferences file (currently empty).
- **Efficiency fixes:**
  - No code/runtime impact. Keep empty file out of commits unless needed, or let tooling manage it, to avoid unnecessary diffs.

---

## `labellens-ui/` (React 19 + TypeScript + Vite frontend)

### `labellens-ui/.gitignore`
- **Purpose:** UI-specific ignores (logs, `node_modules`, `dist`, local files, editor files, `.vercel`).
- **Efficiency fixes:**
  - Merge policy with root `.gitignore` to prevent duplicated/conflicting rules.
  - Consider ignoring `.vite/` and test/coverage outputs if added later.

### `labellens-ui/.oxlintrc.json`
- **Purpose:** Oxlint configuration (React/TS/oxc plugins, hooks/component-export rules).
- **Efficiency fixes:**
  - Add/enable fast correctness rules relevant to this codebase (e.g. unused vars/imports if available) to catch dead code early and keep bundles lean.
  - Keep config minimal for fast lint runs (already good).

### `labellens-ui/index.html`
- **Purpose:** SPA shell, SEO/OG/Twitter/meta, JSON-LD schema, LLM discovery links, noscript/hidden fallback content, mounts `src/main.tsx`.
- **Efficiency fixes:**
  - **Fonts/network:** Google Fonts (`preconnect` + CSS2) add external requests and block/offline risk for kiosk use. Self-host fonts or use system fallbacks and `font-display: swap` to improve first paint and offline reliability.
  - **Large inline payloads:** big JSON-LD graph and verbose noscript/hidden content increase HTML transfer/parse size. Keep essential structured data; move long-form docs to linked pages/files.
  - **Preload critical assets selectively:** consider preloading the app entry/module or hero-critical assets only if measured beneficial; avoid over-preloading.
  - Ensure canonical/URLs (`labellens-ui.vercel.app` vs other domains) are consistent to avoid duplicate-content crawl waste.

### `labellens-ui/package.json`
- **Purpose:** UI package manifest, scripts (`dev/build/lint/preview`), dependencies and devDependencies.
- **Efficiency fixes:**
  - **Audit dependencies for actual use:** `zustand`, `motion`, and `qrcode` are declared but not referenced in `src/` (based on review). Removing unused deps cuts install time, lockfile size, and supply-chain/build surface.
  - Pin/align toolchain strategy intentionally; `typescript` range and Vite/React majors affect build performance and reproducibility.
  - Add a `typecheck` script (e.g. `tsc -b --pretty false`) for fast CI feedback separate from build if useful.
  - Consider `pnpm`-specific optimizations only if needed; lockfile is present (good).

### `labellens-ui/pnpm-lock.yaml`
- **Purpose:** Deterministic dependency lockfile for pnpm.
- **Efficiency fixes:**
  - Generated file—do not hand-edit. Keep it in sync with `package.json` to ensure reproducible, cacheable installs.
  - Prune unused packages by removing unused deps from `package.json` and regenerating; this can significantly reduce lockfile churn/size.
  - No runtime code changes.

### `labellens-ui/tsconfig.json`
- **Purpose:** TypeScript solution-style config referencing app and node configs.
- **Efficiency fixes:**
  - Fine as-is. Keep references minimal to avoid redundant typechecking work.

### `labellens-ui/tsconfig.app.json`
- **Purpose:** TS config for browser app (`src`, strict/lint-like flags, bundler resolution, no emit).
- **Efficiency fixes:**
  - `allowArbitraryExtensions` is enabled; disable unless required to catch mistaken imports earlier (saves debug time).
  - Good strictness (`noUnusedLocals`/`noUnusedParameters`) helps eliminate dead code paths; keep enabled.
  - `skipLibCheck: true` improves build speed (tradeoff accepted).

### `labellens-ui/tsconfig.node.json`
- **Purpose:** TS config for Node-side tooling files (e.g. `vite.config.ts`).
- **Efficiency fixes:**
  - Includes only `vite.config.ts` (good, narrow scope = faster checks).
  - No changes needed.

### `labellens-ui/vite.config.ts`
- **Purpose:** Vite config with React + Tailwind plugins, chunk splitting, dev server proxy to Ollama (`/api/ollama`).
- **Efficiency fixes:**
  - Manual chunking for `@zxing`, icons, and React is good. Verify `motion`/`qrcode`/`zustand` are not bundled unnecessarily (remove if unused).
  - Consider splitting large app data (`database` catalog) into an async chunk/JSON fetch so initial route loads faster.
  - Add build target/browser assumptions only if you need smaller output; measure before changing.
  - Proxy rewrite is fine for dev; ensure production path strategy avoids failed fetch retries.

### `labellens-ui/vercel.json`
- **Purpose:** SPA rewrite to `index.html` for client-side routing/deep links.
- **Efficiency fixes:**
  - Minimal and correct for SPA fallback. If root `vercel.json` also controls deployment, consolidate to avoid config ambiguity.
  - Optionally pair with caching/compression headers at platform level for static assets (not in this file).

### `labellens-ui/README.md`
- **Purpose:** Default Vite React template README (not project-specific).
- **Efficiency fixes:**
  - Replace with LabelLens UI-specific setup/build/env notes (Ollama proxy, scripts, data generation). Accurate docs reduce onboarding and debugging time.
  - Remove irrelevant template guidance to avoid confusion.

### `labellens-ui/public/.well-known/ai-plugin.json`
- **Purpose:** AI plugin/agent manifest pointing to catalog and site metadata.
- **Efficiency fixes:**
  - Keep fields consistent with actual hosted URLs and API/data shapes; stale manifests cause wasted agent retries.
  - If `api.url` points to static JSON, ensure schema/expectations match consumers.

### `labellens-ui/public/about.html`
- **Purpose:** Static about page for project/science exhibition context.
- **Efficiency fixes:**
  - Inline CSS is fine for a standalone page; consider sharing a tiny cached stylesheet if more pages grow.
  - Add explicit image/font sizing if media added later to reduce layout shifts (minor).

### `labellens-ui/public/contact.html`
- **Purpose:** Static contact/exhibition info page.
- **Efficiency fixes:**
  - Same as static pages: lightweight and fine. Keep content consistent with README/schema to avoid support churn.
  - Use real contact endpoints/channels when available to prevent dead-end user flows.

### `labellens-ui/public/privacy.html`
- **Purpose:** Static privacy policy (offline/edge, no tracking claims).
- **Efficiency fixes:**
  - Ensure claims match implementation (e.g. Open Food Facts fallback queries). Accurate policy avoids rework/compliance fixes.
  - Static HTML is efficient; no code changes needed.

### `labellens-ui/public/favicon.svg`
- **Purpose:** Site/app icon (SVG).
- **Efficiency fixes:**
  - SVG is small and scalable (good). Can be minified/optimized (remove metadata/precision) for tiny byte savings if desired.
  - Consider also providing raster/favicons for broader device caching/compat only if needed.

### `labellens-ui/public/llms.txt`
- **Purpose:** Concise LLM-facing project/capability summary and key links.
- **Efficiency fixes:**
  - Keep synchronized with `llms-full.txt`, schema, and actual features to prevent incorrect agent behavior and repeated clarification.
  - Plain text served statically is efficient.

### `labellens-ui/public/llms-full.txt`
- **Purpose:** Detailed technical/spec document (Nutri-Score formulas, knowledge graph, profiles, sample data) for LLMs/crawlers.
- **Efficiency fixes:**
  - Large text file: ensure server/CDN compression (gzip/brotli) is enabled; content is static.
  - Avoid duplicating values that also live in code/JSON unless generated from source; drift creates costly fixes.

### `labellens-ui/public/robots.txt`
- **Purpose:** Crawl directives, sitemap and LLM resource hints.
- **Efficiency fixes:**
  - Verify sitemap/resource URLs point to the canonical deployed domain; incorrect URLs waste crawler/agent requests.
  - `Allow: /` for all agents is fine for a public demo; keep file small.

### `labellens-ui/public/sitemap.xml`
- **Purpose:** XML sitemap for key pages and machine-readable resources.
- **Efficiency fixes:**
  - Keep `lastmod`/URLs accurate and generated if content changes often; stale sitemaps cause unnecessary recrawls or missed updates.
  - Include only canonical, indexable URLs.

### `labellens-ui/public/data/catalog.json`
- **Purpose:** Public JSON catalog of benchmark products (nutrition, ingredients, alternatives, metadata).
- **Efficiency fixes:**
  - **Large payload duplication:** mirrors data embedded in `src/lib/database.ts`. Choose one delivery path (lazy-fetched JSON vs bundled TS) to reduce download/parse/memory duplication.
  - If fetched at runtime, host compressed and consider pagination/chunking or on-demand lookup by barcode to avoid loading all 115+ items up front.
  - Generate from canonical source to prevent field/type drift (e.g. nullability, grades, ids).

### `labellens-ui/public/data/knowledge.json`
- **Purpose:** Public JSON knowledge graph (hidden sugars, palm aliases, EU allergens, EFSA additives).
- **Efficiency fixes:**
  - Duplicates `src/lib/knowledge.ts` (and differs in structure/counts in places). Consolidate to one source to save bytes and maintenance.
  - Can be lazily loaded only when ingredient analysis/detail views need it, if not required for initial scan result.

### `labellens-ui/src/main.tsx`
- **Purpose:** React entry point; creates root and renders `<App />` in `StrictMode`.
- **Efficiency fixes:**
  - Minimal and efficient. In dev, `StrictMode` double-invokes effects—expected; ensure effects (camera/audio/listeners) clean up correctly (see `ScannerHUD`/`App`).
  - No changes needed.

### `labellens-ui/src/App.tsx`
- **Purpose:** Top-level app state/composition: language/profile/model/product selection, scoring/knowledge/profile memoization, tabs (scan/compare), quick benchmarks, idle auto-reset, modal/footer.
- **Efficiency fixes:**
  - **Idle detection overhead:** attaches 5 global listeners and runs a `setInterval` check every 2s for the whole session. Prefer a single debounced/throttled “last activity” update, `visibilitychange` handling, and/or `setTimeout` rescheduled on activity to reduce timer wakeups.
  - `HEALTH_PROFILES.find(...)` per render for active profile name is trivial but can be a precomputed map or memo by id.
  - `handleSelectQuick` is recreated each render; wrap in `useCallback` (minor, avoids child prop churn if passed down later).
  - State reset recreates initial objects repeatedly—extract shared initial constants to avoid small allocations and ensure consistency.
  - Components like `InteractiveBentoGrid`/`ChemicalInspector` are mounted only when expanded (good for work avoidance); keep expensive children memoized where props are stable.

### `labellens-ui/src/index.css`
- **Purpose:** Global styles, Tailwind import/theme tokens, base resets, slider styling, kiosk utilities.
- **Efficiency fixes:**
  - Keep selectors simple (already simple). Tailwind v4 `@theme` tokens are efficient at build time.
  - Ensure unused custom utilities/classes are removed over time to keep CSS output small.
  - Slider/thumb transitions are cheap; no runtime concerns.

### `labellens-ui/src/assets/hero.png`
- **Purpose:** Static hero image asset in source tree.
- **Efficiency fixes:**
  - Verify it is actually referenced; if unused, remove to reduce repo/build asset size.
  - Optimize/compress PNG (or convert to WebP/AVIF with fallback) and size appropriately for display to cut bytes and decode time.
  - Binary asset—no code changes.

### `labellens-ui/src/lib/types.ts`
- **Purpose:** Shared TypeScript domain types (nutrition, scoring, knowledge flags, profiles, products, alternatives, adjustments).
- **Efficiency fixes:**
  - Type-only module; erased at runtime (zero runtime cost). Keep aligned with actual data shapes to prevent runtime guards/casts elsewhere.
  - `HealthProfileId` is currently `'general' | 'diabetic'` while UI copy/docs mention more profiles—align types to avoid dead/branchy handling.

### `labellens-ui/src/lib/scoring.ts`
- **Purpose:** Nutri-Score 2023-style scoring for general foods/beverages, breakdown generation, grade-to-color mapping.
- **Efficiency fixes:**
  - Pure, allocation-light calculations (good). `breakdown` array objects are created per score call—acceptable, but memoize `scoreProduct` results by `(product id, nutrition values, profile inputs)` at call sites if recomputed frequently with identical inputs.
  - Reuse threshold constants (already done). No major changes needed.

### `labellens-ui/src/lib/profiles.ts`
- **Purpose:** Health profile definitions and `applyHealthProfile` adjustment/warning logic (currently General/Diabetic).
- **Efficiency fixes:**
  - Simple branching and small arrays (efficient). `HEALTH_PROFILES.find` by id can be a map if called in hot paths.
  - Avoid duplicate threshold logic already present in scoring/knowledge by sharing helpers/constants where appropriate (maintenance efficiency).
  - Ensure profile list/type parity across UI, i18n, and docs to prevent unused branches.

### `labellens-ui/src/lib/knowledge.ts`
- **Purpose:** Ingredient intelligence: hidden sugar/palm/allergen/additive detection, deductions, and warning generation.
- **Efficiency fixes:**
  - **Pre-normalize inputs once:** currently lowercases each ingredient repeatedly in nested loops (`ing.toLowerCase()` many times) and also builds `fullText`. Normalize `ingredients` to lowercase strings once up front and compare against pre-lowercased terms.
  - **Use faster membership structures:** convert `HIDDEN_SUGAR_LIST`, `PALM_OIL_LIST`, additive keys/names into normalized Sets/maps or a single precompiled regex with word-boundary-aware matching to reduce repeated `includes` scans.
  - **Allergen detection:** iterating all keywords per allergen per ingredient is O(A*K*I). Precompute a keyword→allergen map or Aho-Corasick/combined regex for scale; with current sizes it’s small, but easy to optimize and make matching more accurate.
  - **Additive matching:** `fullText.includes(data.name.toLowerCase())` lowercases names repeatedly—store lowercase names in the DB/constants.
  - Function is pure; memoize by ingredient list/product id in UI if recalculated often (App already memoizes by `currentProduct`).

### `labellens-ui/src/lib/database.ts`
- **Purpose:** Embedded exhibition product catalog, barcode/QR/GS1 parsing and resolution, local/offline lookup, Open Food Facts live lookup, GS1 India fallback, OFF product parsing, and alternative lookup entry points.
- **Efficiency fixes:**
  - **Very large module/bundle hotspot:** embedded `EXHIBITION_PRODUCTS` makes this file ~5.7k lines and inflates initial JS parse/compile/memory. Move catalog to `public/data/catalog.json` (or chunked files) and lazy-load/cache it; keep only logic in TS.
  - **Build indexes once:** replace repeated `EXHIBITION_PRODUCTS.find(...)` scans with module-level `Map`s for `id`, raw barcode, unpadded barcode, aliases, and `qr_code_url`; rebuild only if data changes.
  - **Faster live lookup resolution:** `lookupProductLive` fires multiple OFF requests and uses `Promise.allSettled` then picks the first fulfilled in array order, waiting for all to settle. Use `Promise.any`/custom race that resolves on first valid product and aborts remaining requests to cut latency and bandwidth.
  - **Deduplicate URL construction/normalization:** avoid creating/pushing duplicate barcode variants and recomputing `replace(/^0+/, '')` repeatedly; normalize once per query.
  - **Parsing guards:** `extractBarcodeFromPayload` and `resolveQrOrBarcode` run multiple regex/JSON paths; fast-path common cases (pure digits, exact local URL match via map) before expensive attempts.
  - **`getContextualAlternatives` / `getHealthierAlternatives`:** indirection is fine; ensure alternatives with `target_id` can be resolved via indexed lookup.
  - Consider caching recent `lookupProductLive` results (in-memory LRU) for repeated scans of same barcode.

### `labellens-ui/src/lib/barcodeScanner.ts`
- **Purpose:** ZXing reader singleton setup, native `BarcodeDetector` support checks, multi-pass canvas/image scanning with crops/contrast/rotation, and image-file scan pipeline.
- **Efficiency fixes:**
  - **Reuse `BarcodeDetector` instance:** `detectWithNativeAPI` constructs a new detector on every call; when used in polling loops this is costly. Cache a singleton (and recreate only if formats/options change or on error).
  - **Reduce canvas churn:** each pass allocates new canvases/contexts and sometimes full `ImageData`. Reuse a small pool of offscreen canvases (full, crop, contrast, rotated) and `willReadFrequently` contexts.
  - **Contrast pass cost:** per-pixel JS loop over large images (`1200x1200`) runs on main thread. Downscale more aggressively for preprocessing, use `OffscreenCanvas`/worker if available, or skip expensive passes when a quick native/ZXing decode already succeeds.
  - **Pass ordering/early exits:** native detector is tried first (good). Avoid redundant native calls on canvases that are simple transforms of an already-failed source unless measured helpful.
  - **`scanImageFileWithAllEngines`:** image decode + canvas draw is fine; consider `createImageBitmap` for faster decode/resize pipelines on supported browsers.

### `labellens-ui/src/lib/foodClassifier.ts`
- **Purpose:** Non-food detection heuristics using keyword/brand/chemical-marker lists.
- **Efficiency fixes:**
  - Combine `productName/category/brand` into one lowercase string once (already done). Pre-lowercase all keyword arrays at module init to avoid repeated literal comparisons overhead only if refactored, but main win is structure: flatten patterns into a single scanned structure or precompiled regexes for fewer passes.
  - For `ingredients`, joining once is good; check markers against normalized text once.
  - Early-return ordering is fine (cheap checks). Can memoize by `(name, category, brand, ingredients hash)` if called repeatedly for same product.

### `labellens-ui/src/lib/indianFmcg.ts`
- **Purpose:** GS1 India manufacturer prefix registry and fallback `ProductItem` resolver for `890...` barcodes.
- **Efficiency fixes:**
  - **Avoid sorting on every lookup:** `resolveGs1IndiaBarcode` copies and sorts `GS1_INDIA_MANUFACTURERS` by prefix length on each call. Pre-sort once at module load (`const SORTED_GS1 = [...]`) and iterate directly.
  - Prefix matching is linear over ~20 entries (fine after pre-sort). If registry grows, use a trie or check known prefix lengths.
  - `ProductItem` object construction allocates per call—acceptable for scan events.

### `labellens-ui/src/lib/alternativesEngine.ts`
- **Purpose:** Rule-based contextual healthier alternative suggestions and optional Ollama-generated AI swaps.
- **Efficiency fixes:**
  - `getContextualAlternatives` lowercases/joins fields on every call; cheap but can accept precomputed normalized metadata if available. Many sequential `includes` checks are fine due to early returns.
  - Move static swap templates to data/constants shared with UI if reused; avoid recreating identical objects except where necessary.
  - `generateAiSwapsWithOllama`: includes timeout/abort (good). Validate response schema defensively to avoid retry loops in callers; consider shorter prompt/context and capped tokens are already set (good).
  - Cache AI swap results per `product.id + modelName` to avoid repeated expensive model calls.

### `labellens-ui/src/lib/ollamaVision.ts`
- **Purpose:** Image downscaling/base64 encoding for vision, Ollama availability check, and vision-based nutrition/product extraction into `ProductItem`.
- **Efficiency fixes:**
  - **Downscaling path:** draws to canvases and encodes JPEG; for `File/Blob` inputs prefer `createImageBitmap(file, { resizeWidth/Height ... })` when supported to reduce memory/CPU.
  - `toDataURL('image/jpeg', 0.85)` + base64 adds ~33% size overhead; unavoidable for Ollama API format, but keep dimensions/quality tuned (already 640px cap, good).
  - `checkOllamaAvailable` uses short timeout (good). Debounce/reuse recent health-check results to avoid repeated probes during scan flows.
  - JSON parse fallback is good; strict schema validation/coercion can prevent downstream recomputation/errors.

### `labellens-ui/src/lib/sound.ts`
- **Purpose:** Web Audio API sound effects (barcode beep, success chime, alert buzzer) with enable/disable toggle.
- **Efficiency fixes:**
  - Lazy `AudioContext` creation and `resume` on demand is good. Reuse context (already done).
  - Oscillator/gain nodes per sound are short-lived and fine. No changes needed.
  - Consider persisting sound preference if desired (UX), not a runtime efficiency issue.

### `labellens-ui/src/lib/i18n.ts`
- **Purpose:** Static English/Hindi translation strings and `Language` type.
- **Efficiency fixes:**
  - Constant object lookup (efficient). If languages/keys grow, split by locale and lazy-load non-default language bundles.
  - Ensure keys are typed/complete to avoid fallback logic at runtime.

### `labellens-ui/src/components/ScannerHUD.tsx`
- **Purpose:** Main scanning UI: camera/upload/barcode tabs, live camera stream, ZXing/native barcode detection, image capture/upload processing, product lookup, AI vision fallback, status/error display.
- **Efficiency fixes:**
  - **Native detector recreation in loop:** `startCamera` creates `new window.BarcodeDetector(...)` inside a `setInterval` every 150ms. Create once per camera session and reuse.
  - **Dual decode pipelines:** starts continuous ZXing `decodeFromVideoElement` and also a manual native-detector interval; both may decode simultaneously and trigger duplicate work/lookups (partly mitigated by `lastScannedRef` time guard). Coordinate into one primary path with fallback.
  - **ZXing lifecycle cleanup:** on `stopCamera` it nulls the reader ref but does not call `BrowserMultiFormatReader.reset()`/stop controls; continuous decode callbacks/streams may linger depending on library behavior. Explicitly reset/stop to free camera/CPU.
  - **`cameraMode` behavior:** live scanning appears active regardless of “Scan Barcode” vs “Read Label (AI Vision)” mode; if vision-only/manual capture is intended in vision mode, gate continuous decode accordingly to save CPU/battery.
  - **Canvas in interval:** allocates `offscreenCanvas` and draws frames repeatedly (good reuse of one canvas) but runs on main thread; consider reducing frequency, pausing when tab hidden (`document.hidden`), or stopping after successful resolution.
  - **`allowOnlineFallback` state:** toggled in UI but not passed into `lookupProductLive`/resolution logic; either wire it through or remove state to avoid confusing behavior and unnecessary renders.
  - **Large component:** split into smaller hooks/components (camera controller, upload handler, result resolver) for maintainability and to limit re-render scope.
  - Reuse `getOptimizedZxingReader()` instance consistently (already used) and avoid duplicate scanning passes on the same frame when not needed.

### `labellens-ui/src/components/VerdictCard.tsx`
- **Purpose:** Displays Nutri-Score grade strip, product verdict, sugar visualization/comparison, nutrient bars, and detailed points-deduction breakdown.
- **Efficiency fixes:**
  - Many derived values computed with `useMemo` (good for `sugarStats`). Nutrient/penalty arrays are recreated each render; memoize them from `product`/`scoringResult`/`language`.
  - Rendering up to 24 spoon badges is cheap; if `roundedSpoons` could be larger in future, cap or summarize visually.
  - Static maps/constants (`GRADES`, `NUTRI_COLORS`) are module-level (good). No heavy runtime issues.

### `labellens-ui/src/components/InteractiveBentoGrid.tsx`
- **Purpose:** Nutrition metrics display and interactive reformulation sliders/presets with live updates to parent.
- **Efficiency fixes:**
  - Local state mirrors props; keyed remount from `App` is correct for product switches. `updateValue`/presets create new nutrition objects (necessary for immutability).
  - `handleReset`/callbacks can be `useCallback` to reduce child/input churn (minor).
  - Slider `onChange` fires frequently; parent recomputes score/knowledge/profile memos—this is intended, but ensure expensive derivations are memoized (App already uses `useMemo`).

### `labellens-ui/src/components/ChemicalInspector.tsx`
- **Purpose:** Ingredient/additive summary cards and expandable/filterable ingredient chip list with knowledge flags.
- **Efficiency fixes:**
  - **Per-render flag scans:** in the expanded list it computes `isSugar/isPalm/isAllergen/isAdditive` for every ingredient via multiple `.some(...includes...)` calls on each render/tab change. Precompute a `Map/Set` of flagged ingredient strings/categories once per `ingredients+knowledge` (memoized) for O(1) lookups during render.
  - `activeTab` filtering is fine. Consider `useMemo` for derived counts/lists if props grow.
  - Keys use index in chip list; acceptable for static ordered ingredient lists but stable keys preferred if list can be edited/reordered.

### `labellens-ui/src/components/HealthierAlternativesCard.tsx`
- **Purpose:** Shows healthier alternatives, optional Ollama-generated swaps, and “inspect swap” navigation to known products.
- **Efficiency fixes:**
  - `useMemo` depends on `product` and `customAiSwaps` (good), but recomputes alternatives when `product` object identity changes; ensure parent passes stable references when unchanged.
  - Caches AI-generated swaps only in component state until product changes? state persists per mount; keyed by product in parent would reset (App doesn’t key this card except `key={...product.id}`—good, resets custom swaps on product change).
  - `findProductById` called during render for each swap; use indexed lookup map for O(1).
  - Disable repeated AI requests while generating (already done) and cache results by product/model to save model inference cost.

### `labellens-ui/src/components/ComparisonArena.tsx`
- **Purpose:** Side-by-side comparison of two selectable exhibition products with Nutri-Score metrics and winner summary.
- **Efficiency fixes:**
  - `EXHIBITION_PRODUCTS.find(...)` for both selections runs on every render; build/use an id→product map.
  - Rendering all products in two `<select>` lists (2 * N options) is cheap at 115 items but can be memoized.
  - `scoreProduct` called twice per render; memoize scores by `prodA.id`/`prodB.id` (nutrition inputs stable).
  - Uses raw selects (accessible/simple, good).

### `labellens-ui/src/components/Navbar.tsx`
- **Purpose:** Sticky header with brand/offline indicator, profile switch, language toggle, and settings dropdown (model, sound, fullscreen, pitch modal).
- **Efficiency fixes:**
  - **Fullscreen state sync:** sets local `isFullscreen` optimistically but doesn’t listen for `fullscreenchange` (Esc or browser UI can exit fullscreen). Add an event listener to keep state/UI accurate and avoid stale toggles.
  - Outside-click listener is attached/removed based on menu open (good). `HEALTH_PROFILES.map` over 2 items is trivial.
  - No major performance issues.

### `labellens-ui/src/components/ExhibitionPitchModal.tsx`
- **Purpose:** Modal dialog describing the project/problem/solution for exhibition judges.
- **Efficiency fixes:**
  - Rendered conditionally (`if (!isOpen) return null`) which is efficient. Static content.
  - Add focus trap/escape-key handling and scroll locking only if needed for UX/accessibility; not a compute efficiency issue.

---

## `labellens/` (Python Streamlit app)

### `labellens/README.md`
- **Purpose:** Documentation for the Python/Streamlit LabelLens app (features, models, run/test/demo instructions).
- **Efficiency fixes:**
  - Keep in sync with actual behavior (ports, models, file names) to reduce trial-and-error runs.
  - Document `scan_history.db` as local-generated and not to commit; currently DB is present in repo.

### `labellens/requirements.txt`
- **Purpose:** Python dependencies for Streamlit app (`streamlit`, `ollama`, `pillow`, `requests`).
- **Efficiency fixes:**
  - Pin or constrain versions (with hashes/lock via pip-tools/uv if desired) for reproducible, cacheable installs.
  - Separate dev/test deps (e.g. `pytest`) from runtime deps to keep production/exhibition environments lighter.

### `labellens/run.bat`
- **Purpose:** Windows batch launcher for Streamlit app.
- **Efficiency fixes:**
  - Simple launcher; no runtime inefficiency. Could check for venv/python/port availability to fail fast.

### `labellens/run.ps1`
- **Purpose:** PowerShell launcher for Streamlit app.
- **Efficiency fixes:**
  - Same as batch: fine. Consider `Set-StrictMode`/error handling for quicker diagnostics.

### `labellens/app.py`
- **Purpose:** Main Streamlit application: page setup, CSS injection, session state, analysis pipeline, sidebar controls, tabs for scan/barcode deck/compare/demo/history.
- **Efficiency fixes:**
  - **Rerun-heavy architecture:** Streamlit reruns the script on interactions. Avoid repeated expensive work: cache static data/HTML where possible (`@st.cache_data` for barcode deck/demo lists, CSS file reads, knowledge data loads) and avoid recomputing scores unless inputs changed.
  - `load_custom_css()` reads `ui/styles.css` from disk and injects on every run; cache file contents.
  - `history.init_db()` called at startup (ok) but history functions also call it repeatedly—centralize initialization.
  - `process_nutrition_analysis` always recomputes scoring+knowledge+profile; memoize by a hash of inputs/profile if called multiple times per interaction.
  - `get_all_offline_barcodes()` returns full copies/lists used in multiple tabs; cache once per session/run.
  - Large inline HTML strings and `st.html` calls are fine, but `ui_comp.clean_html` regex on big blocks adds CPU per render—minimize/strip at source where possible.

### `labellens/barcode_engine.py`
- **Purpose:** Offline barcode product database, checksum/cleaning helpers, image barcode scan attempts, and barcode lookup with optional Open Food Facts fallback.
- **Efficiency fixes:**
  - **Lookup normalization:** `lookup_barcode` tries multiple code variants with repeated dict lookups/copies; normalize candidate codes once and probe a prebuilt index.
  - **`scan_barcode_from_image`:** imports `pyzbar` dynamically and opens image; PIL-based fallback branch is mostly empty (wasted path) — implement efficiently or remove dead branch. Avoid reopening/decoding images multiple times across callers.
  - **Deep copies:** `copy.deepcopy` for returned products is safe but slower than shallow copy + copy of mutable nested fields when structure is known.
  - **Online requests:** `requests.get` without session reuse; use a module/session with connection pooling if multiple lookups occur. Timeout is set (good).
  - Deduplicate static product data with UI/Python demo data sources if possible.

### `labellens/demo_data.py`
- **Purpose:** Predefined demo scans/products for exhibition mode without camera/Ollama.
- **Efficiency fixes:**
  - Static in-memory data (efficient). `get_demo_scan` does linear search by id—use a dict keyed by id for O(1) if list grows.
  - Keep demo nutrition values consistent with scoring expectations/tests (already aligned).

### `labellens/extractor.py`
- **Purpose:** Ollama vision extraction: image resize/encode, prompt/JSON parsing/validation, model status checks, and label extraction calls.
- **Efficiency fixes:**
  - **Image processing:** converts modes and always JPEG-encodes; skip conversion/copy when already RGB JPEG-sized appropriately. Resizing with Pillow is CPU-bound—fine, but avoid duplicate work if caller already resized.
  - `check_ollama_status` calls `ollama.list()` on demand; cache briefly (e.g. per run/session) to avoid repeated daemon queries in UI reruns.
  - Retry path sends a second model request on parse failure (doubles latency/cost); improve prompt/schema adherence or use a stricter parse/repair step first when possible.
  - Reuse HTTP/model client internals where the library supports it; `ollama.chat` per call is typical.

### `labellens/history.py`
- **Purpose:** SQLite scan history persistence: init schema, save/fetch/delete/clear scans, aggregate stats.
- **Efficiency fixes:**
  - **Repeated `init_db()` calls:** most functions call `init_db()` which executes `CREATE TABLE IF NOT EXISTS` and opens a connection each time. Initialize once at app startup or guard with a module-level flag.
  - **Connection-per-operation:** open/close connections for each call adds overhead. For Streamlit/single-user kiosk, reuse a connection (with proper thread handling) or batch operations.
  - `get_history`/`get_scan` repeatedly `json.loads` multiple columns per row; parse lazily only when needed or select fewer columns for list views.
  - Add indexes if history grows (e.g. on `timestamp`, `is_demo`) for faster queries/stats.

### `labellens/knowledge.py`
- **Purpose:** Ingredient intelligence: load JSON knowledge data, detect hidden sugars, palm oil, allergens, additives, and compute score modifiers/warnings/flags.
- **Efficiency fixes:**
  - **Data loading:** `_ensure_loaded` loads JSON files once lazily (good). Keep files small and parsed structures ready.
  - **Detection complexity:** `find_hidden_sugars`/`find_palm_oil` do nested loops over ingredients × terms with fuzzy/substring checks (`difflib.SequenceMatcher` in `_ingredient_contains` and `_fuzzy_match`) — can be expensive. Pre-normalize terms, use direct substring/regex matching first, and reserve fuzzy matching for unmatched cases or shorter candidate sets.
  - **`find_additives`:** scans full joined text for every additive name alias; build a combined searchable structure or lowercase `full_text` once (it does) and pre-lowercase aliases in loaded data.
  - **Allergen matching:** checks all synonyms against all text items; pre-index synonyms by normalized tokens/strings.
  - Cache `analyze_ingredients` results for identical ingredient lists within a request/run.

### `labellens/profiles.py`
- **Purpose:** Health profile definitions and score/warning/advice adjustment logic.
- **Efficiency fixes:**
  - Lightweight dict-driven logic (efficient). No changes needed.
  - Profile names/keys must match UI/app usage exactly to avoid fallback-to-General surprises (correctness/efficiency of debugging).

### `labellens/scoring.py`
- **Purpose:** Nutri-Score calculation for general foods/beverages, grade mapping, 1–10 scaling, and display helpers.
- **Efficiency fixes:**
  - Pure numeric logic with small fixed loops (efficient). Breakdown list/dicts allocated per score—fine.
  - Keep threshold tables as constants (already done). No significant runtime issues.

### `labellens/scan_history.db`
- **Purpose:** SQLite database file containing persisted scan history (runtime/local data artifact).
- **Efficiency fixes:**
  - **Should not be committed:** binary DB in repo inflates clone/fetch size and causes merge/conflict noise. Remove from version control and rely on `.gitignore` (`*.db`).
  - If sample history is needed for demos, ship a seed script or fixture instead of a mutable DB file.
  - Periodic vacuum/retention policy can keep local DB small over long kiosk sessions.

### `labellens/tests/test_scoring.py`
- **Purpose:** Pytest/unittest-style executable tests for scoring, knowledge detection, profiles, and barcode engine basics.
- **Efficiency fixes:**
  - Covers key cases (good). To speed test runs as suite grows, group/parametrize similar assertions and avoid redundant imports/computation.
  - `if __name__ == "__main__"` custom runner is handy but duplicative with pytest; keep one primary path if CI is added.
  - Tests import from project modules via `sys.path` hack—consider package structure/`PYTHONPATH` or `pytest.ini` for cleaner, faster collection.

### `labellens/data/additives.json`
- **Purpose:** EFSA additive reference data grouped by concern level for knowledge engine.
- **Efficiency fixes:**
  - Static data loaded at runtime; keep normalized/preprocessed forms if matching cost matters (e.g. pre-lowercased aliases) or generate them at build/startup once.
  - Ensure no duplication with UI `knowledge.ts/json` sources.

### `labellens/data/allergens.json`
- **Purpose:** EU allergen definitions/synonyms for detection.
- **Efficiency fixes:**
  - Same as above: single canonical source, precompute lookup structures on load (synonym → allergen key) for O(1)/fast matching.
  - Large synonym lists are fine if indexed.

### `labellens/data/hidden_sugars.json`
- **Purpose:** List of hidden sugar aliases for detection.
- **Efficiency fixes:**
  - Convert to a normalized set/regex at load time for faster checks than repeated linear/fuzzy scans.
  - Deduplicate with UI knowledge data.

### `labellens/data/palm_oil.json`
- **Purpose:** Palm oil term variants for detection.
- **Efficiency fixes:**
  - Same: pre-normalize/index at load; share source of truth with UI.

### `labellens/ui/__init__.py`
- **Purpose:** Package marker for Streamlit UI helper module.
- **Efficiency fixes:**
  - Empty/marker file; no runtime cost. Fine as-is.

### `labellens/ui/animations.js`
- **Purpose:** Client-side JS for staggered card animations; observes DOM mutations for Streamlit rerenders.
- **Efficiency fixes:**
  - **MutationObserver on whole `document.body` with `subtree: true`:** runs callback on every DOM mutation in the app, then queries for `[data-stagger]:not([data-animated])`. Scope observer to a container if possible, debounce the callback, or disconnect when not needed to reduce main-thread work during frequent Streamlit updates.
  - `querySelectorAll` + style writes per batch are small; batching via `requestAnimationFrame` can avoid layout thrash if many elements animate.
  - Currently not obviously injected/used by `app.py` (CSS/HTML are injected) — verify usage; unused scripts should be removed.

### `labellens/ui/components.py`
- **Purpose:** Server-side HTML component builders for Streamlit (verdict cards, gauges, ingredient chips, nutrition grid, comparisons, status, skeletons, history, hero, etc.) plus helper data mappers.
- **Efficiency fixes:**
  - **`clean_html` runs on every decorated render:** multiple regex passes and line splitting/joining over large HTML strings (`verdict_card`, grids, etc.) cost CPU on every Streamlit rerun. Generate clean/minified HTML directly (avoid leading indentation in templates) so sanitization can be skipped or reduced to a fast path.
  - **Repeated string concatenation in loops:** building large HTML via `+=` in Python creates many intermediate strings. Use list append + `''.join(...)` for ingredient chips, breakdown rows, cards, etc.
  - **Inline `<style>` blocks inside components:** some components emit `<style>`/keyframes each time they render, duplicating CSS in DOM. Move static styles to `ui/styles.css` (or inject once) and keep only dynamic values inline.
  - Cache/pure-function memoization is possible for identical inputs, but Streamlit reruns usually recreate inputs; focus on cheaper rendering.
  - `extract_flags_dict`/`prepare_verdict_inputs` do linear scans; fine for typical ingredient counts, but can use sets/maps for repeated lookups.

### `labellens/ui/styles.css`
- **Purpose:** Dark kiosk theme and Streamlit UI overrides (variables, layout, components, animations, utilities).
- **Efficiency fixes:**
  - Large stylesheet injected into app; minify for production and remove unused selectors/duplicate rules (e.g. keyframes or classes not referenced) to reduce parse/apply cost.
  - Many broad selectors and `!important` overrides are sometimes necessary for Streamlit, but keep specificity targeted where possible to simplify style recalculation.
  - Animations (`pulse`, `shimmer`, etc.) are GPU-friendly when using transform/opacity; audit any layout-triggering animated properties.

---

## Notes on intentionally not reviewed as source
- No additional tracked project source files were found outside the paths listed above when excluding `.git/`, `node_modules/`, `dist/`, `.vercel/`, `__pycache__/`, `.pytest_cache/`, and Vite temp caches. If any new files are added, include them in this review.
- `pnpm-lock.yaml` is reviewed as a generated manifest; line-level code suggestions are not applicable.