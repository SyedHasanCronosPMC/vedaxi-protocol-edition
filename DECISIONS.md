# Decisions

## 2026-08-30 — G1 initial environment assessment

- The repository was documentation-only, so a Vite + React + TypeScript application was scaffolded at the project root for the required WebMCP probe.
- The authoritative v2 pack supersedes the older tool-surface policy where they differ: availability is eligibility-first, intent matching is deterministic aliases, and `compare_sources` needs two FOCUSED assets.
- The G1 probe was deployed publicly at `https://elastic-web-g1-probe.netlify.app` and returned HTTP 200 on 2026-08-30 16:22 Dubai time.
- WebMCP observation outcome: **not yet observed**. This session cannot automate the ChatGPT Desktop app, so it cannot truthfully record tool discovery, execution, or A/B/C refresh behavior. The deployed probe initializes A/B/C and swaps B/C for D without reloading; it is ready for the target-environment check.
