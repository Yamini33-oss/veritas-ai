# VERITAS AI — Frontend

"Don't trust one AI. Make AI verify AI."

Frontend-only build for the hackathon project. No backend, auth, or real
LLM calls yet — everything runs on mock data through a service layer
(`src/services/`) designed to be swapped for real API calls later
without touching any component.

## Stack
React + Vite + TypeScript + Tailwind CSS v4 + Framer Motion + React Router

## Run it
```
npm install
npm run dev
```

## Structure
```
src/
  types/        domain types (Agent, Verification)
  data/         mock data (the 8-agent council)
  services/     interfaces + mock implementations — swap these for real APIs later
  components/
    layout/     Nav, Footer
    landing/    Landing page sections
    visuals/    decorative SVG/Framer Motion pieces (CouncilGlyph)
    ui/         small shared UI (PagePlaceholder)
  pages/        one component per route
```

## Routes
`/` `/agents` `/verify` `/verification/:id` `/report/:id` `/history` `/how-it-works`

Only `/` (Landing) is fully built. The rest are placeholders, wired up
and ready for the next pass.
