# Project memory

## Product intent & audience

- App: **智齡樂活 Silver Spark** (renamed from "Beyond Scroll Bloom App"), built with Vite + React, Traditional Chinese (繁體中文) interface.
- Target audience: elderly users (長者). Core goal is NOT to encourage more screen time; it helps seniors reduce over-reliance on passive entertainment (short videos) and redirect time toward brain activities, physical exercise, interest exploration, and real social interaction.
- All features should serve this health-oriented goal.

## Brand personality & voice

- Tone: friendly, non-judgmental, encouraging, professional, clear, and warm.
- Treat screen time not as a raw number but as a tool to build healthy digital habits.
- Language: Traditional Chinese throughout.

## Visual design & UX direction

- Color palette: forest green (森林綠), sage green (鼠尾草綠), cream white (奶油白), warm orange (暖橙).
- Elderly-friendly design: large fonts, clear information hierarchy, easy-to-operate interface.
- Homepage screen-time block is critical — placed directly below greeting area as a prominent hero section.
  - Deep forest-green card showing today's usage as "X 小時 X 分鐘" with demo-data label.
  - Daily goal (2 hours) with progress bar: green when under target, warm orange when exceeded.
  - Adaptive encouraging copy based on usage; highlights time spent on beneficial activities (walking, stretching).
  - "睇每週使用報告" button expands a 7-day bar chart.
  - "放低手機做運動" shortcut links to challenges page.
- Existing pages: challenges, activities, friends circle (朋友圈), personal center (個人中心).

## Decisions, constraints & rationale

- **Never remove, hide, or weaken the homepage screen-time block** — it is the highest-priority homepage feature.
- Preserve all existing features and completed pages when adding new functionality.
- Brand name unified across all surfaces: homepage branding, browser title, personal center, share titles, descriptions.
- Build passes; all 11 existing tests pass after changes.

## Open questions & assumptions

- Screen-time data is currently simulated/demo; real device-level Screen Time API integration not yet addressed.
- Daily 2-hour goal is a placeholder value; may need configurability per user.
- Weekly report is shown as an inline expandable bar chart; standalone report page not yet built.