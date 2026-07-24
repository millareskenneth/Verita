# Project Documentation: Free API Discovery & Security Hub

## 1. Project Overview

**Working Title:** Free API Hub (placeholder — rename as desired)

This project is a web-based platform that discovers, catalogs, and documents **free and open-source APIs** found across the internet (search engines, GitHub, GitLab, developer forums, etc.), making them easy for developers to find, understand, test, and safely integrate into their own projects.

The platform solves three core problems developers face when looking for free APIs:

1. **Discovery is hard** — free APIs are scattered across blog posts, GitHub repos, and search results with inconsistent or missing documentation.
2. **Trust is hard** — developers can't easily tell whether an API is safe, actively maintained, or potentially malicious/vulnerable before using it.
3. **Evaluation is slow** — developers usually have to sign up, read fragmented docs, and write test code just to see if an API fits their needs.

The platform addresses this by combining **automated discovery**, **standardized documentation**, **in-browser testing**, and **automated security/vulnerability scanning** into a single system.

---

## 2. Goals & Objectives

| Goal | Description |
|---|---|
| Convenience | Centralize free/open-source APIs in one searchable catalog instead of scattered sources. |
| Clarity | Auto-generate or normalize documentation so every API has a consistent, readable reference. |
| Confidence | Let developers try an API directly on the platform before writing any code. |
| Security | Scan and score each API for malicious behavior or vulnerabilities before developers rely on it. |

---

## 3. Target Users

- Independent developers and hobbyists looking for free APIs for side projects.
- Startups/students needing quick prototyping resources without cost.
- Security-conscious teams who want a vetted source of third-party APIs.

---

## 4. Core Features

### 4.1 Web Scraping & Discovery Engine
- Crawls search engines (Google, Bing, etc.) and developer platforms (GitHub, GitLab, npm/PyPI registries, public API directories like RapidAPI's free tier listings) using targeted queries (e.g., `"free api"`, `"public api" site:github.com`, `open source api documentation`).
- Extracts candidate API endpoints, repository metadata (README, license file, stars, last commit date), and any existing documentation.
- Filters results to include only:
  - Explicitly **free** APIs (no paid tiers required for core functionality).
  - **Open-source** projects (verified via license file: MIT, Apache 2.0, GPL, BSD, etc.).
- De-duplicates and normalizes entries into a structured catalog.

### 4.2 Documentation Generator/Aggregator
- Automatically parses existing docs (README, OpenAPI/Swagger specs, Postman collections) when available.
- Normalizes documentation into a consistent template for every API, including:
  - Description & use case
  - Base URL / endpoint list
  - Authentication method (API key, OAuth, none, etc.)
  - Request/response examples
  - Rate limits (if published)
  - License type
  - Source/repo link
- Flags APIs with missing or incomplete documentation for manual review or community contribution.

### 4.3 In-Browser API Tester ("Try it now")
- Lets developers send live requests to an API directly from the platform (similar to Postman or Swagger UI) without leaving the site.
- Supports common parameters, headers, and auth fields.
- Displays real-time response, status code, and latency.
- Optionally saves a request as a code snippet (cURL, JavaScript fetch, Python `requests`, etc.) for the developer to copy into their own project.

### 4.4 Security & Vulnerability Scanner
- Before an API is published (and periodically afterward), it is passed through automated checks such as:
  - **Endpoint reputation check** — cross-referencing domain/IP against known malware/blacklist databases.
  - **SSL/TLS validation** — verifying the API enforces HTTPS and has a valid certificate.
  - **Static analysis of source code** (if open-source) — scanning the repo for known vulnerable dependencies (e.g., via tools like OSV, Snyk-style dependency checks) and suspicious code patterns (e.g., obfuscated code, hidden data exfiltration calls).
  - **Behavioral test calls** — sending sandboxed test requests to check for unexpected redirects, excessive data collection, or unsafe response headers.
  - **Dependency/license audit** — flags APIs relying on deprecated or abandoned libraries with known CVEs.
- Produces a **Trust/Security Score** (e.g., Low/Medium/High risk, or a numeric score) displayed on each API's page.
- Re-scans APIs on a schedule (e.g., weekly/monthly) since a previously safe API/repo can change.

### 4.5 Search & Categorization
- Full-text search across API names, descriptions, and tags.
- Category filters (Weather, Finance, AI/ML, Geolocation, Entertainment, etc.).
- Sorting by popularity, trust score, last updated, or documentation completeness.

### 4.6 Community Layer (optional/future)
- Developer reviews/ratings per API.
- Ability to report a broken or suspicious API.
- Contribution flow for developers to submit an API manually (also passed through the same scanning pipeline).

---

## 5. System Architecture (High-Level)

```
                     ┌─────────────────────┐
                     │   Scraper Service    │  (crawls Google, GitHub, etc.)
                     └──────────┬───────────┘
                                │ raw candidate APIs
                                ▼
                     ┌─────────────────────┐
                     │  Extraction & Filter  │  (license check, "free" filter)
                     └──────────┬───────────┘
                                ▼
                     ┌─────────────────────┐
                     │ Documentation Parser │  (README/OpenAPI → normalized doc)
                     └──────────┬───────────┘
                                ▼
                     ┌─────────────────────┐
                     │  Security Scanner    │  (static + dynamic checks, scoring)
                     └──────────┬───────────┘
                                ▼
                     ┌─────────────────────┐
                     │     API Catalog DB    │
                     └──────────┬───────────┘
                                ▼
        ┌───────────────────────┴────────────────────────┐
        ▼                                                 ▼
┌───────────────┐                               ┌───────────────────┐
│  Web Frontend  │  (search, docs, tester UI)    │   Admin Dashboard   │
└───────────────┘                               └───────────────────┘
```

### Suggested Tech Stack (recommendation, adjust to team preference)

| Layer | Suggested Tools |
|---|---|
| Scraping | Python (Scrapy / BeautifulSoup / Playwright for JS-heavy pages), GitHub REST/GraphQL API |
| Backend/API | Node.js (Express/NestJS) or Python (FastAPI/Django) |
| Database | PostgreSQL (catalog data) + Elasticsearch/OpenSearch (search) |
| Security Scanning | OSV/Snyk-style dependency scanning, ClamAV or custom static analysis, sandboxed containers (Docker) for behavioral testing |
| Frontend | React/Next.js, Swagger UI or custom API tester component |
| Hosting | Cloud provider (AWS/GCP/Azure) with containerized services |
| Scheduling | Cron jobs / message queue (e.g., RabbitMQ, Celery) for periodic re-scraping and re-scanning |

---

## 6. User Workflow

1. Developer visits the platform and searches for an API category (e.g., "weather").
2. Sees a list of free, open-source APIs with a **trust/security badge** on each.
3. Clicks into an API's documentation page — sees normalized docs, license, and source link.
4. Uses the **"Try it now"** tester to send a live request and inspect the response.
5. Copies a ready-made code snippet into their own project.
6. (Optional) Leaves a rating or reports an issue with the API.

---

## 7. Security Scanning Workflow (Detail)

1. **Pre-publish scan**: every newly discovered API/repo goes through static + dynamic checks before appearing in the public catalog.
2. **Scoring**: results are combined into a single trust score with a breakdown (e.g., "SSL: Pass", "Dependencies: 2 known vulnerabilities", "Domain reputation: Clean").
3. **Continuous monitoring**: scheduled re-scans catch APIs that later become compromised, abandoned, or have new vulnerabilities disclosed.
4. **Quarantine**: APIs that fail critical checks are hidden or clearly flagged as "Not recommended" rather than being silently removed, so developers have transparency.

---

## 8. Legal & Compliance Considerations

These need attention early in the project, since they affect scraping and API redistribution:

- **Search engine ToS**: Google/Bing restrict automated scraping of search results; consider using official APIs (Google Custom Search API, Bing Web Search API) instead of raw scraping to avoid ToS violations.
- **GitHub scraping**: prefer the official GitHub REST/GraphQL API (rate-limited but ToS-compliant) over HTML scraping.
- **License compliance**: only list APIs/repos with licenses that permit the intended use (documentation, testing, indexing). Attribute original authors clearly.
- **API provider ToS**: even "free" APIs may have usage terms (e.g., attribution requirements, rate limits, no-resale clauses) — the platform should surface these, not just ignore them.
- **Liability disclaimer**: since the security scanner cannot guarantee 100% detection, the platform should include a clear disclaimer that trust scores are advisory, not a guarantee of safety.

*(This section is informational, not legal advice — consider a review by legal counsel before launch.)*

---

## 9. Roadmap (Suggested Phases)

**Phase 1 — MVP**
- Manual/seed catalog of free APIs (curated list) to validate the concept.
- Basic normalized documentation pages.
- Simple in-browser tester (GET requests only).

**Phase 2 — Automation**
- Automated scraping via official search/GitHub APIs.
- Automated documentation parsing (OpenAPI/README ingestion).
- Basic security scanning (SSL check, domain reputation, license check).

**Phase 3 — Advanced Security**
- Static code analysis for open-source repos.
- Dependency vulnerability scanning.
- Sandboxed behavioral testing of live endpoints.
- Trust score system with periodic re-scans.

**Phase 4 — Community & Scale**
- User ratings/reviews.
- Community-submitted APIs (through the same vetting pipeline).
- Advanced search, personalized recommendations, category expansion.

---

## 10. Success Metrics

- Number of verified free/open-source APIs cataloged.
- Average time for a developer to go from search → working test call.
- Percentage of catalog with a passing security score.
- User retention / return visits to the tester tool.
- Number of flagged/reported unsafe APIs caught before user harm.

---

## 11. Open Questions & Proposed Solutions

### 11.1 Index-only vs. host/proxy?

**Decision direction: index-only for launch, with an optional "proxy lite" later.**

- **Index-only (default)**: the platform just points to the original API. Lowest liability, lowest infra cost, and no responsibility if the upstream API goes down or misbehaves.
- **Optional lightweight proxy** (Phase 3+), only for APIs that pass security scanning, used to:
  - Cache responses for the in-browser tester (faster demos, fewer calls hitting the real provider).
  - Normalize inconsistent auth/response formats for a smoother "try it now" experience.
- If a proxy is added, enforce a **usage cap per user/IP** and clear terms that it's for testing/evaluation only, not production traffic — this avoids becoming an unpaid CDN for someone else's API and limits liability if a proxied API is later found malicious.
- Middle-ground approach: **sandboxed test calls go through the proxy, but the copied code snippet always points to the original API** — developers get a smooth testing experience without the platform sitting in the request path for their real projects.

### 11.2 Verifying "free" stays free long-term

This is fundamentally a **monitoring + community feedback problem**, since providers can change pricing anytime.

- **Automated re-checks**: periodically re-fetch each API's pricing/docs page and diff it against the last snapshot; flag for review if wording like "pricing," "paid tier," or "credit card required" appears where it didn't before.
- **Response-based detection**: during scheduled re-scans, if a previously free endpoint starts returning `402 Payment Required`, `403`, or a new auth error, auto-flag it as "possibly no longer free."
- **Community reporting**: a simple "This is no longer free" button lets users self-report faster than any scraper will catch it — pair this with automated checks rather than relying on either alone.
- **Status labels instead of binary free/paid**: e.g., `Free`, `Free tier (limits apply)`, `Recently changed — under review`, `Delisted`. This is more honest than trying to guarantee something outside the platform's control.
- **Grace period, not instant removal**: when a change is detected, mark the API "under review" for a short window before delisting, to avoid false positives from temporary outages.

### 11.3 Re-scraping / re-scanning frequency

Rather than a single fixed schedule, **tier the frequency by risk and popularity** to balance cost against freshness:

| Tier | Criteria | Frequency |
|---|---|---|
| High priority | Popular APIs (high traffic on the platform) or previously flagged/borderline | Daily–weekly |
| Standard | Most catalog entries | Monthly |
| Low priority | Rarely-used, low-traffic, stable/long-unchanged entries | Quarterly |

Additional cost-saving measures:
- **Event-triggered scans**: for GitHub-hosted APIs, use **webhooks** (new commit, new release, README change) to trigger a re-scan instead of polling on a timer — much cheaper than blind rescraping.
- **Lightweight health check vs. full scan**: run a cheap "is it still up / still free / still HTTPS" ping frequently, but reserve the expensive full security scan (static analysis, dependency audit) for a slower cadence or when the lightweight check detects a change.
- **User-triggered rescan**: let developers click "recheck this API" (rate-limited) — crowdsources freshness for the APIs people actually care about right now.

### 11.4 Should community contribution be open from day one?

**Decision direction: closed/invite-only at launch, opened in phases.** Moderation overhead is easy to underestimate early on, so contribution access should scale with the platform's ability to vet submissions.

1. **Phase 1 (MVP)**: curated list only, no public submissions. The team controls quality and security-scans every entry directly.
2. **Phase 2**: a "Suggest an API" form — submissions enter a private review queue, still gated by team review + automated security scan before anything goes live. No public posting yet.
3. **Phase 3**: open submissions, but **every submission automatically runs through the full scraping/documentation/security pipeline** (the same one used for auto-discovered APIs) before it becomes visible — never trust-by-default just because a human submitted it.
4. **Phase 4**: add lightweight community trust signals (ratings, "report an issue" flags) once there's enough volume and a moderation process (even a simple one, like a small review team or reputation-gated submissions) to handle it.

This phased approach avoids the two failure modes: launching with an empty, hard-to-grow catalog, or launching open and getting flooded with low-quality/malicious submissions before the scanning pipeline is mature enough to catch them.

---

*This document is a living draft intended to guide initial planning, architecture discussions, and stakeholder alignment. It should be revised as scope, tech stack, and legal review are finalized.*
