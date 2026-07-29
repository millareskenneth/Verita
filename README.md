# Verita — Frontend

Web frontend for **Verita**, a platform that discovers, catalogs, documents, and helps developers safely evaluate free and open-source APIs.

Verita combines search, normalized documentation, in-browser testing, and trust scoring so developers can go from discovery to a working integration with confidence.

## Tech stack

| Layer | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Language | TypeScript |
| Data | REST client with mock fallback for local development |

## System overview

How Verita fits into the wider platform:

```mermaid
flowchart TD
    User[Developer] --> FE[Verita Frontend]
    FE --> BE[Backend API]
    BE --> DB[(Catalog Database)]
    BE --> Search[Search Index]
    BE --> Scanner[Security Scanner]
    Scanner --> Score[Trust Score]
    Score --> DB
    DB --> FE
```

## User journey

Typical flow through the product:

```mermaid
flowchart LR
    A[Search or browse] --> B[View API page]
    B --> C[Read normalized docs]
    C --> D[Try it now tester]
    D --> E[Copy code snippet]
    E --> F[Use in your project]
```

## Frontend routes

App Router pages and how they connect:

```mermaid
flowchart TD
    Home["/ Home"] --> Catalog["/apis Catalog"]
    Home --> Search["/search Search"]
    Home --> Categories["/categories/:category"]
    Catalog --> Detail["/apis/slug API detail"]
    Detail --> Docs[Documentation]
    Detail --> Tester[In-browser tester]
    Detail --> Trust[Trust score panel]
    Home --> Submit["/submit Suggest API"]
```

## Data flow

How the frontend loads catalog data during development and in production:

```mermaid
sequenceDiagram
    participant Page as Next.js page
    participant Client as API client
    participant Backend as Backend API
    participant Mock as Mock seed data

    Page->>Client: searchApis / getApiBySlug
    Client->>Backend: GET /api/catalog
    alt Backend available
        Backend-->>Client: JSON response
        Client-->>Page: Catalog data
    else Backend unavailable
        Client->>Mock: Fallback lookup
        Mock-->>Client: Seed catalog
        Client-->>Page: Catalog data
    end
```

## Project structure

```text
src/
├── app/                         # App Router pages
│   ├── page.tsx                 # Home (search + featured APIs)
│   ├── apis/
│   │   ├── page.tsx             # Catalog listing
│   │   └── [slug]/page.tsx      # API docs, tester, trust score
│   ├── categories/[category]/   # Category-filtered catalog
│   ├── search/                  # Search results
│   ├── submit/                  # Suggest API (Phase 2 placeholder)
│   └── admin/                   # Admin dashboard shell
├── components/
│   ├── layout/                  # Header, footer, shell
│   ├── catalog/                 # Search, filters, API cards
│   ├── api-detail/              # Docs, endpoints, security badges
│   ├── tester/                  # In-browser API tester
│   └── ui/                      # Shared UI primitives
├── data/mock-apis.ts            # Phase 1 seed catalog
├── hooks/                       # Client-side search and tester hooks
├── lib/
│   ├── api/                     # Backend client and endpoint map
│   ├── constants/               # App config and categories
│   └── utils/                   # Formatting helpers
└── types/                       # Shared TypeScript types
```

## Getting started

### Prerequisites

- Node.js 20+
- npm 10+

### Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Description | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend base URL | `http://localhost:8000` |

When the backend is not running, the UI automatically falls back to seed data in `src/data/mock-apis.ts`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production server |
| `npm run lint` | Run ESLint |

## MVP scope (Phase 1)

- Curated catalog pages with trust badges
- Normalized documentation layout per API
- Simple GET-only in-browser tester
- Code snippet export (cURL, JavaScript, Python)
- Admin dashboard shell for future moderation tools

## Roadmap alignment

```mermaid
flowchart TB
    subgraph phase1 [Phase 1 MVP]
        P1A[Curated catalog]
        P1B[Docs and tester]
    end

    subgraph phase2 [Phase 2 Automation]
        P2A[Scraping pipeline]
        P2B[Submission queue]
    end

    subgraph phase3 [Phase 3 Advanced Security]
        P3A[Dependency scanning]
        P3B[Behavioral tests]
    end

    subgraph phase4 [Phase 4 Community]
        P4A[Ratings and reports]
    end

    phase1 --> phase2 --> phase3 --> phase4
```

## Related docs

- Product specification: [`Project_Documentation_Free_API_Hub.md`](./Project_Documentation_Free_API_Hub.md)

## Notes on Mermaid in this README

Diagrams use GitHub-compatible Mermaid syntax:

- Standard `flowchart` and `sequenceDiagram` blocks
- Quoted labels for nodes that contain slashes or special characters
- No custom themes or HTML styling that GitHub may not render

If a diagram does not appear immediately on GitHub, refresh the page or view the file on github.com rather than in a plain-text preview.
