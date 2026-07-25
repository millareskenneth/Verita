# Verita — Step-by-Step Build Plan

Track progress as you build Verita feature by feature. Check off items as you complete them.

**Related docs:** [Product spec](./Project_Documentation_Free_API_Hub.md) · [Frontend README](./README.md) · [Backend README](../free-api-backend/README.md)

**Repos:**
| Repo | Path | Role |
| --- | --- | --- |
| Verita | `Verita/` | Next.js frontend |
| free-api-backend | `free-api-backend/` | FastAPI backend, workers, scanners |

---

## How to use this plan

1. **Build in order** — later steps depend on earlier ones.
2. **Do not skip verification** — each step has a gate. Pass it before moving on.
3. **One vertical slice at a time** — finish backend + frontend + test for a feature before starting the next.
4. **Update checkboxes** — change `[ ]` to `[x]` when done.

### Current snapshot (as of plan creation)

| Area | Status |
| --- | --- |
| Frontend Phase 1 UI | ~90% done (catalog, detail, tester, trust panel) |
| Backend Phase 1 API | ~60% done (catalog read, health, partial submissions) |
| Workers / automation | Scaffolded, mostly stubs |
| Security pipeline | Tools exist, not wired end-to-end |
| Auth | Not started |

---

## Phase 0 — Development baseline

> **Goal:** Both apps run locally and talk to each other. Nothing else until this works.

### 0.1 Backend infrastructure

- [ ] Copy `.env.example` → `.env` in `free-api-backend/`
- [ ] Start Postgres + Redis: `docker compose up -d postgres redis`
- [ ] Run migrations: `alembic upgrade head`
- [ ] Seed catalog: `python scripts/seed_catalog.py`
- [ ] Start API: `docker compose up api` (or `uvicorn backend.main:app --reload`)

**Verify before 0.2:**
```bash
curl http://localhost:8000/api/health
# Expected: {"status":"ok"}

curl http://localhost:8000/api/catalog
# Expected: JSON with at least 2 APIs (Open-Meteo, REST Countries)
```

### 0.2 Frontend connected to backend

- [ ] Copy `.env.example` → `.env.local` in `Verita/`
- [ ] Set `NEXT_PUBLIC_API_URL=http://localhost:8000`
- [ ] Run `npm install && npm run dev`

**Verify before Phase 1:**
- [ ] Home page loads at `http://localhost:3000`
- [ ] Catalog shows **backend data** (2 APIs), not mock fallback
- [ ] Visit `/apis/open-meteo` — detail page loads from backend
- [ ] Stop backend → frontend falls back to mock (4 APIs) — confirms fallback works

---

## Phase 1 — MVP completion

> **Goal:** A polished, trustworthy curated catalog. Frontend and backend fully aligned.  
> **Do not start Phase 2 until all Phase 1 gates pass.**

### 1.1 Align seed data (backend ↔ frontend)

**Build:**
- [ ] Add CoinGecko Demo + PokéAPI to `free-api-backend/scripts/seed_catalog.py`
- [ ] Match fields in `Verita/src/data/mock-apis.ts` (endpoints, trust scores, examples)

**Verify before 1.2:**
```bash
curl http://localhost:8000/api/catalog | jq '.total'
# Expected: 4

curl http://localhost:8000/api/catalog/coingecko-demo
curl http://localhost:8000/api/catalog/pokeapi
# Expected: 200 with full detail
```
- [ ] Frontend `/apis` shows same 4 APIs as backend (with backend running)
- [ ] All 6 category pages return relevant results where applicable

### 1.2 Catalog API hardening

**Build:**
- [ ] Add pytest tests for catalog list, detail, 404, sort, category filter, pagination
- [ ] Fix any schema mismatches between backend responses and `Verita/src/types/`

**Verify before 1.3:**
```bash
cd free-api-backend && pytest -v
# Expected: all catalog tests pass
```
- [ ] `GET /api/catalog?category=weather` returns only weather APIs
- [ ] `GET /api/catalog?sort=trust-score` returns correctly ordered results
- [ ] `GET /api/catalog/nonexistent` → 404

### 1.3 Trust score on detail pages

**Build:**
- [ ] Seed `security_scans` rows for all 4 APIs **or** improve `/api/catalog/{slug}/security` fallback to return meaningful checks (not empty `[]`)
- [ ] Ensure frontend trust panel renders real checks from backend

**Verify before 1.4:**
```bash
curl http://localhost:8000/api/catalog/open-meteo/security | jq '.checks'
# Expected: non-empty array with labeled checks (SSL, license, etc.)
```
- [ ] `/apis/open-meteo` shows trust badge + breakdown panel with real data
- [ ] Risk level (low/medium/high) matches score

### 1.4 In-browser API tester (GET only)

**Build:**
- [ ] Confirm tester works for APIs that allow browser CORS (Open-Meteo, REST Countries)
- [ ] Document CORS limitation in UI for blocked APIs

**Verify before 1.5:**
- [ ] On `/apis/open-meteo`, send a GET request → see status code, latency, response body
- [ ] Code snippet export works (cURL, JavaScript, Python)
- [ ] Tester shows a clear message when CORS blocks the request (e.g. CoinGecko)

### 1.5 Search and catalog UX polish

**Build:**
- [ ] Wire home search → `/search?q=...`
- [ ] Confirm sort options work end-to-end (popularity, trust-score, last-updated, doc-completeness)
- [ ] Add `.env.example` to Verita if missing

**Verify before Phase 2 gate:**
- [ ] Search for "weather" returns Open-Meteo
- [ ] Search for "pokemon" returns PokéAPI
- [ ] Empty search shows helpful empty state
- [ ] `npm run build` succeeds with no errors

### ✅ Phase 1 gate — full MVP demo

Run this checklist before starting automation:

| Check | Pass? |
| --- | --- |
| 4 APIs in backend and frontend (connected) | [ ] |
| All catalog routes work (`/`, `/apis`, `/search`, `/categories/*`, `/apis/[slug]`) | [ ] |
| Trust score panel shows real checks | [ ] |
| Tester works for at least 2 APIs | [ ] |
| Code snippets copy correctly | [ ] |
| Backend pytest suite green | [ ] |
| No console errors on main user flows | [ ] |

---

## Phase 2 — Automation

> **Goal:** APIs enter the catalog via pipeline, not manual seeding.  
> **Prerequisite:** Phase 1 gate passed.

### 2.1 Wire Celery workers (foundation)

**Build:**
- [ ] Confirm worker + beat containers start: `docker compose up worker beat`
- [ ] Add logging so tasks are visible in worker output
- [ ] Create a simple "ping" task to validate queue → worker → result

**Verify before 2.2:**
```bash
# Trigger ping task, check worker logs for success
docker compose logs worker --tail=50
```

### 2.2 Submission flow (community suggest API)

**Build:**
- [ ] Enable submit form in `Verita/src/app/submit/` (currently disabled placeholder)
- [ ] Wire to `POST /api/catalog/submissions`
- [ ] Show success/error feedback to user
- [ ] Implement `process_submission` Celery task (minimal: save + log)

**Verify before 2.3:**
```bash
curl -X POST http://localhost:8000/api/catalog/submissions \
  -H "Content-Type: application/json" \
  -d '{"name":"Test API","sourceUrl":"https://github.com/example/api","description":"Test"}'
# Expected: 202 with submission id
```
- [ ] Row appears in `api_submissions` table with `status=pending`
- [ ] Frontend form submits and shows confirmation

### 2.3 Admin submission queue (no auth yet)

**Build:**
- [ ] Add backend endpoint: `GET /api/admin/submissions?status=pending` (dev-only or basic key)
- [ ] Wire admin dashboard to live data instead of mock stats
- [ ] Approve/reject actions (update submission status)

**Verify before 2.4:**
- [ ] `/admin` shows pending submissions from DB
- [ ] Approve/reject updates status in database

> ⚠️ **Note:** Add real auth before production. For now, keep admin local-only.

### 2.4 Discovery pipeline

**Build:**
- [ ] Wire `run_discovery_cycle` task → `DiscoveryOrchestrator`
- [ ] Configure GitHub token in backend `.env` (`GITHUB_TOKEN`)
- [ ] Dedupe candidates → create new `api_entries`
- [ ] Optional: Google/Bing search API keys for broader discovery

**Verify before 2.5:**
- [ ] Run discovery task manually; worker logs show candidates found
- [ ] At least 1 new API entry created in catalog from discovery
- [ ] Duplicates are not inserted twice

### 2.5 Documentation parser

**Build:**
- [ ] Implement `parse_documentation` task: README + OpenAPI parsing
- [ ] Auto-populate `endpoints`, `request_example`, `response_example` on new entries
- [ ] Flag entries with low `documentation_completeness` for review

**Verify before 2.6:**
- [ ] Newly discovered API has auto-generated endpoint list
- [ ] OpenAPI spec (if present in repo) is parsed into normalized format

### 2.6 Basic security scanning (lightweight)

**Build:**
- [ ] Wire lightweight scan on new entries: SSL check + license validation
- [ ] Persist results to `security_scans` table
- [ ] Update `trust_score` on `api_entries`

**Verify before 2.7:**
- [ ] New catalog entry has a `security_scans` row after pipeline runs
- [ ] `/api/catalog/{slug}/security` returns SSL + license checks

### 2.7 API tester proxy (CORS workaround)

**Build:**
- [ ] Implement `GET /api/catalog/{slug}/test` (backend proxy for tester)
- [ ] Update frontend tester to use proxy when direct fetch fails
- [ ] Add rate limiting via `RateLimitService` on proxy endpoint

**Verify before Phase 3 gate:**
- [ ] CoinGecko (or other CORS-blocked API) works through proxy
- [ ] Proxy returns status, headers, body, latency
- [ ] Rate limit returns 429 after threshold

### ✅ Phase 2 gate — automation demo

| Check | Pass? |
| --- | --- |
| User can submit an API via frontend | [ ] |
| Admin sees and can approve/reject submissions | [ ] |
| Discovery task finds and catalogs new APIs | [ ] |
| Documentation auto-parsed for new entries | [ ] |
| Basic SSL/license scan runs on new entries | [ ] |
| Tester proxy works for CORS-blocked APIs | [ ] |

---

## Phase 3 — Advanced security

> **Goal:** Trust scores backed by real, repeatable scans.  
> **Prerequisite:** Phase 2 gate passed.

### 3.1 Full security scan pipeline

**Build:**
- [ ] Wire `run_full_scan` task: SSL → OSV → Semgrep → `TrustScoreCalculator`
- [ ] Persist full check breakdown to `security_scans.checks`
- [ ] Install OSV-Scanner and Semgrep in worker container (or document host setup)

**Verify before 3.2:**
- [ ] Run full scan on an open-source API with a GitHub repo
- [ ] `/security` returns dependency + static analysis checks
- [ ] Score recalculated and saved to DB

### 3.2 Docker sandbox (behavioral tests)

**Build:**
- [ ] Implement `SandboxRunner` (currently stub)
- [ ] Enable via `SECURITY_SANDBOX_ENABLED=true`
- [ ] Check for unexpected redirects, unsafe headers, excessive data in responses

**Verify before 3.3:**
- [ ] Behavioral check appears in trust breakdown
- [ ] Sandbox failures lower trust score appropriately

### 3.3 Scheduled re-scans

**Build:**
- [ ] Configure Celery beat schedules:
  - Daily: lightweight health checks (SSL, uptime)
  - Weekly/monthly: full scans based on API tier
- [ ] Update `scanned_at` and re-score on each run

**Verify before 3.4:**
- [ ] Beat scheduler triggers scan tasks on schedule
- [ ] Stale entries get rescanned; scores update in catalog

### 3.4 Quarantine and delisting

**Build:**
- [ ] Auto-flag APIs that fail critical checks (`free_status=delisted` or quarantine flag)
- [ ] Hide or mark quarantined APIs in catalog list
- [ ] Show transparent "Not recommended" banner on detail page

**Verify before Phase 4 gate:**
- [ ] API with failed critical scan is hidden or clearly flagged
- [ ] Quarantined API still accessible via direct URL with warning (transparency)

### 3.5 Postgres full-text search

**Build:**
- [ ] Populate `search_vector` column (trigger or `SearchService.reindex_entry`)
- [ ] Switch catalog search from ILIKE to FTS
- [ ] Reindex existing entries

**Verify before Phase 4:**
```bash
curl "http://localhost:8000/api/catalog?q=geolocation"
# Expected: faster, more relevant results than ILIKE
```

### ✅ Phase 3 gate — security demo

| Check | Pass? |
| --- | --- |
| Full scan (OSV + Semgrep + SSL) runs end-to-end | [ ] |
| Trust scores reflect real scan results | [ ] |
| Scheduled re-scans work via Celery beat | [ ] |
| Quarantine flow hides/flags risky APIs | [ ] |
| FTS search improves catalog queries | [ ] |

---

## Phase 4 — Community & scale

> **Goal:** Platform ready for public growth.  
> **Prerequisite:** Phase 3 gate passed.

### 4.1 Authentication & admin protection

**Build:**
- [ ] Choose auth approach (JWT, session, or OAuth)
- [ ] Protect `/admin` routes on frontend
- [ ] Protect admin API endpoints on backend
- [ ] Admin role for moderation actions

**Verify before 4.2:**
- [ ] Unauthenticated user cannot access `/admin`
- [ ] Admin API returns 401/403 without valid credentials

### 4.2 Admin moderation tools

**Build:**
- [ ] List all catalog entries with filters (status, score, category)
- [ ] Manual trigger: "Recheck this API" → enqueue full scan
- [ ] Manual quarantine/delist/restore actions
- [ ] Submission review with one-click approve → run full pipeline

**Verify before 4.3:**
- [ ] Admin can trigger rescan and see updated score
- [ ] Approve submission → API appears in public catalog after pipeline

### 4.3 User ratings and reports

**Build:**
- [ ] DB models: `ratings`, `reports` (broken API, suspicious behavior)
- [ ] API endpoints: submit rating, submit report
- [ ] UI on API detail page: star rating + report button
- [ ] Admin view for reported APIs

**Verify before 4.4:**
- [ ] User can rate an API (1–5 stars)
- [ ] User can report an API with reason
- [ ] Admin sees reports queue

### 4.4 Elasticsearch / OpenSearch (optional scale)

**Build:**
- [ ] Implement Elasticsearch backend in `SearchService`
- [ ] Env toggle: `SEARCH_BACKEND=postgres|elasticsearch`
- [ ] Index sync on catalog changes

**Verify before 4.5:**
- [ ] Search works with Elasticsearch enabled
- [ ] Fallback to Postgres FTS if ES unavailable

### 4.5 Free-status monitoring

**Build:**
- [ ] Periodic checks: 402 responses, pricing page diffs, auth requirement changes
- [ ] Update `free_status` field (free → free-tier → delisted)
- [ ] Notify admin of status changes

**Verify before 4.6:**
- [ ] API that starts requiring payment gets flagged
- [ ] Catalog reflects updated free status

### 4.6 Legal & compliance (UI)

**Build:**
- [ ] Trust score disclaimer on every API page ("advisory, not a guarantee")
- [ ] License attribution and source links prominently displayed
- [ ] Terms of service / privacy policy pages
- [ ] Document scraping compliance (official APIs only)

**Verify before launch:**
- [ ] Disclaimer visible on API detail pages
- [ ] Every API shows license + source link
- [ ] Legal pages linked in footer

### ✅ Phase 4 gate — launch readiness

| Check | Pass? |
| --- | --- |
| Admin auth enforced | [ ] |
| Full moderation workflow works | [ ] |
| Ratings and reports functional | [ ] |
| Search scales (FTS or Elasticsearch) | [ ] |
| Free-status monitoring active | [ ] |
| Legal disclaimers and attribution in place | [ ] |

---

## Recommended build order (summary)

```text
Phase 0  Dev baseline (Docker, migrations, FE↔BE connection)
   ↓
Phase 1  MVP polish (seed sync, tests, trust scores, tester)
   ↓ verify full demo
Phase 2  Automation (submissions, discovery, doc parser, basic scan, proxy)
   ↓ verify pipeline end-to-end
Phase 3  Security (OSV, Semgrep, sandbox, re-scans, quarantine, FTS)
   ↓ verify trust scores are real
Phase 4  Community (auth, admin tools, ratings, scale, legal)
   ↓ verify launch checklist
Launch
```

---

## Quick reference — key files

| Task | File(s) |
| --- | --- |
| Seed data | `free-api-backend/scripts/seed_catalog.py`, `Verita/src/data/mock-apis.ts` |
| Catalog API | `free-api-backend/backend/api/routes/catalog.py` |
| Frontend client | `Verita/src/lib/api/client.ts` |
| Types (shared contract) | `Verita/src/types/api.ts`, `free-api-backend/backend/schemas/` |
| Celery tasks | `free-api-backend/backend/workers/tasks/` |
| Security tools | `free-api-backend/backend/security/` |
| Discovery | `free-api-backend/backend/scrapers/pipelines/` |
| DB schema | `free-api-backend/alembic/versions/0001_initial_schema.py` |
| Submit form | `Verita/src/app/submit/` |
| Admin dashboard | `Verita/src/app/admin/` |
| API tester | `Verita/src/components/tester/` |

---

## Progress log

Use this section to note dates and notes as you complete phases.

| Date | Phase / Step | Notes |
| --- | --- | --- |
| | | |
| | | |
| | | |

---

*Last updated: 2026-07-25*
