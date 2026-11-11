# Tengo Solar

Static site (no build step). Residential and small commercial solar, Andhra Pradesh first.

## Run locally
`cd site && python3 -m http.server 8000` then open http://localhost:8000

## Deploy (Cloudflare Pages)
Framework preset: None. Build command: leave empty. Build output directory: `site`.

## Rules
- No secrets in this repo. Real keys live in Cloudflare and Supabase settings.
- Config values in `site/config/` are UNVERIFIED placeholders until sourced and dated.
- Telugu strings in `site/assets/app.js` need native-speaker review.
- Next stages: database migrations (RLS), lead-form Edge Function, calculators.
