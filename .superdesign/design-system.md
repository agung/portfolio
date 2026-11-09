# Agung Nugraha Portfolio — Backend Control Plane

## Product and audience

A one-page personal portfolio for Agung “Nugraha” Nugraha, a backend-focused software engineer. The primary audience is engineering leaders and recruiters. The interface should demonstrate how Nugraha thinks about systems while keeping every portfolio section readable for non-engineering visitors.

## Core concept

Treat the portfolio as a backend control plane with five connected modes:

1. A real interactive CLI is the entry point. Commands such as `whoami`, `ls projects/`, `cat experience.log`, `curl /skills`, and `help` return portfolio content. It supports autocomplete, history, clickable command suggestions, and a reset action.
2. An API explorer presents `GET /about`, `GET /skills`, `GET /projects`, `GET /experience`, and `POST /contact`. “Try it out” returns readable JSON from the actual page data.
3. A monitoring view visualizes only honest portfolio telemetry. Until real analytics are connected, charts and health values must visibly say `demo telemetry` and must not imply production measurements.
4. A system map uses the supplied products and integrations as an editable concept map. It may show OMS, PIM, Marketplace Adapter, Shopee, TikTok, Lazada, Blibli, and Shopify, but must not invent an employer architecture or technical decision.
5. A career log shows the supplied employment timeline and Kawan Lama training. Incident or postmortem entries remain empty or clearly marked “detail needed” until Nugraha provides a real problem, root cause, fix, and result.

## Visual direction

The page feels like a serious operations interface rendered on warm paper. The command line is actual navigation and returns real content. Use a dense but calm desktop layout with a narrow command rail and a large work surface. On mobile, the rail becomes a horizontal mode switch and every panel becomes a single readable column.

## Color tokens

- Canvas: `#F3EEE3`
- Primary ink and dark console: `#111111`
- Accent and active state: `#D9541E`
- Paper surface: `#FAF7F0`
- Muted text: `#686158`
- Hairline: `rgba(17, 17, 17, 0.18)`
- Console text: `#F3EEE3`

No gradients, glow, neon, or multi-color status palette. Orange marks the selected mode, cursor, request method, and focus.

## Typography

- Reddit Sans for headings and prose because it stays approachable at dashboard density.
- JetBrains Mono for the wordmark, CLI, endpoint paths, JSON, timestamps, node labels, and compact metadata.
- Body size starts at 17–18px. Interface metadata must remain at least 12px and high contrast.
- Large title text is compact, direct, and never styled as generic terminal ASCII art.

## Layout and components

- Sticky top bar with `nugraha@dev:~$`, open-to-work state, section shortcuts, theme control, and contact action.
- Intro uses a bold statement beside a functional command console.
- Main control plane uses an asymmetric split: command/mode rail plus changing content surface.
- API rows are expandable records, not repeated cards.
- Monitoring uses one primary chart and a compact health table. Every demo value carries a visible `demo` label.
- System map uses explicit connector lines and selectable nodes. A detail drawer explains only supplied facts or a visible request for missing detail.
- Career log uses timestamps and severity-style labels as structure. It must not turn job changes into fake incidents.
- Corners stay small, between 0 and 8px. Panels use rules and background contrast instead of shadows.

## Content constraints

- Use only the supplied products, projects, roles, dates, companies, integrations, and Kawan Lama training.
- Products: OMS, PIM, Affiliate, Journal, Marketplace Adapter, Belanjaku.
- Projects: Hushpuppies, ACE & Informa for Kawan Lama Group, and OMS support.
- Experience: 2019–2020 Junior Backend Engineer at ICUBE; 2020–2025 Software Engineer at iCube by SIRCLO; 2025–present Software Engineer at ICUBE.
- Never invent uptime, latency, request volume, incident details, architecture decisions, results, testimonials, or project metrics.
- The contact email remains a visible placeholder until supplied.

## Motion and behavior

- The terminal cursor may blink only while its input is focused.
- Mode changes use a short opacity/translate transition. No perpetual dashboard animation.
- Every control works by keyboard, including terminal history, autocomplete, endpoint execution, node selection, theme switching, and mobile mode navigation.
- Respect `prefers-reduced-motion`.
