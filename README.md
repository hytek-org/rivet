# Rivet

**A minimal, dependable browser-based HTTP workspace for developers.**

Rivet is a focused, client-side developer tool for building HTTP requests, inspecting responses, and testing public REST APIs directly in your browser.

Built with React 19, TypeScript, TanStack Router, and Tailwind CSS.

---

## Overview

Rivet provides an engineering-focused environment for working with HTTP APIs without unnecessary complexity, mock responses, or cloud-sync overhead.

### Key Capabilities

- **Real HTTP Request Engine:** Executes authentic browser-side network requests using `window.fetch`. Rivet does not simulate success or substitute mock response objects.
- **Full HTTP Method Support:** Full support for `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`.
- **Query Parameter Management:** Add, edit, remove, and toggle parameters with automated `URLSearchParams` encoding and URL synchronization.
- **Request Headers & Restricted Header Warnings:** Custom request header editor with real-time detection and explanatory warnings for browser-restricted headers (`Host`, `Cookie`, `Origin`, `Sec-*`, etc.).
- **JSON Request Body Editor:** Syntax validation in real-time with line/error feedback, JSON formatting (prettify), sample payload generation, and sensible restrictions for bodyless methods.
- **Authentication:** First-class support for Bearer Token and Basic Authentication. Sensitive credentials are transmitted directly to the remote server and never persisted to local storage.
- **In-Flight Cancellation:** Abort active network requests immediately using native `AbortController`.
- **Comprehensive Response Inspector:** Inspect HTTP status codes, status descriptions, high-precision latency (`performance.now()`), payload byte sizing, response headers, and formatted JSON bodies with copy actions and raw view toggles.
- **Accurate Error Categorization:** Distinct, understandable feedback for DNS/network failures, CORS restrictions, mixed content (HTTPS vs HTTP), timeouts, and cancelled requests.
- **Public API Catalogue:** Searchable index of verified, CORS-enabled public APIs (JSONPlaceholder, Open-Meteo, GitHub, DummyJSON, PokeAPI, REST Countries) with one-click loading into the workspace.
- **Privacy-First Local History:** Automatically logs past requests into bounded browser storage (`localStorage`) with all sensitive credentials and authentication tokens sanitized and stripped.
- **Consistent Design System:** Restrained, high-contrast theme supporting both Light (Canvas `#F5F5F3`) and Dark (Graphite `#17191D`) palettes with persistence and system preference detection.
- **Keyboard Navigation & Command Palette:** Global shortcut (`⌘K` / `Ctrl+K`) to jump to endpoints, workspace views, or documentation.

---

## Getting Started

### Prerequisites

- Node.js (version 18 or newer recommended)
- npm or pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd rivet
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Build for production:

   ```bash
   npm run build
   ```

5. Run linting checks:

   ```bash
   npm run lint
   ```

6. Generate TanStack Router route tree:
   ```bash
   npm run generate-routes
   ```

---

## Project Architecture

```text
src/
├── components/
│   ├── layout/
│   │   ├── AppHeader.tsx        # Navigation, theme toggle, search trigger
│   │   └── AppLayout.tsx        # Shell layout, global shortcuts, command palette
│   ├── request/
│   │   ├── RequestBuilder.tsx   # Method selector, URL bar, send/cancel controls
│   │   ├── QueryEditor.tsx      # Query parameters grid and live string compiler
│   │   ├── HeadersEditor.tsx    # Header table with restricted header warnings
│   │   ├── BodyEditor.tsx       # JSON editor with syntax validation and formatting
│   │   └── AuthEditor.tsx       # Bearer and Basic authentication handlers
│   ├── response/
│   │   ├── ResponseViewer.tsx   # Status, latency, size, and body tabs
│   │   ├── ResponseHeaders.tsx  # Filterable response headers table
│   │   └── ResponseMetadata.tsx # Execution details and runtime context
│   ├── history/
│   │   └── HistoryPanel.tsx     # Slide-over history drawer in playground
│   └── ui/
│       ├── Button.tsx           # Accessible button component
│       ├── Badge.tsx            # HTTP method and status code badges
│       └── CommandPalette.tsx   # Keyboard-accessible quick switcher (Cmd+K)
│
├── lib/
│   ├── http/
│   │   ├── types.ts             # Strong TypeScript definitions for requests/responses
│   │   ├── restrictedHeaders.ts # Browser Fetch restricted header specifications
│   │   ├── errors.ts            # Error classification (CORS, network, abort, timeout)
│   │   └── client.ts            # Core HTTP execution engine
│   ├── history/
│   │   ├── types.ts             # History entry schema
│   │   └── storage.ts           # Local storage persistence with privacy scrubbing
│   ├── catalogue/
│   │   └── endpoints.ts         # Curated list of verified open REST APIs
│   ├── theme/
│   │   └── useTheme.ts          # Light/dark theme hook and DOM synchronizer
│   └── utils.ts                 # Classname utility helpers
│
├── routes/
│   ├── __root.tsx               # Root route with AppLayout wrapper
│   ├── index.tsx                # Rivet homepage and feature overview
│   ├── playground.tsx           # Primary interactive API workspace
│   ├── explore.tsx              # Public API explorer with debounced search
│   ├── history.tsx              # Dedicated request history management
│   └── docs.tsx                 # In-depth technical documentation
│
├── styles.css                   # Design tokens, CSS variables, typography
└── routeTree.gen.ts             # Automatically generated TanStack route tree
```

---

## Browser Security & CORS Notes

Because Rivet executes requests directly in the client browser:

1. **Cross-Origin Resource Sharing (CORS):** The remote server must return appropriate CORS headers (e.g. `Access-Control-Allow-Origin: *`) to allow the browser to expose the response payload to JavaScript.
2. **Restricted Headers:** Certain headers (`Host`, `Cookie`, `Origin`, `User-Agent`, `Referer`, `Sec-*`) are governed by the browser and cannot be set programmatically.
3. **Mixed Content:** Browsers block unencrypted `http://` requests when Rivet is served over `https://`.

---

## License

--------
