# KramaAI BMS — Marketing Site

> Static marketing website for **KramaAI BMS** — vertical business management + AI for gyms, kids centers, studios, and spas.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)
![License](https://img.shields.io/badge/License-MIT-yellow)

**Live Site:** [bms-website-eta.vercel.app](https://bms-website-eta.vercel.app)

---

## Overview

A polished, static marketing homepage for KramaAI's Business Management System. Built with vanilla HTML, CSS, and JavaScript — no framework overhead. Deployed on Vercel with build-time configuration injection.

## Features

- **Responsive marketing homepage** — Hero, features, pricing, testimonials, FAQ, CTA
- **Dedicated scheduling page** — Calendly/Cal.com integration for demo booking
- **Contact form** — Web3Forms integration for lead capture
- **Legal pages** — Terms, Privacy Policy, and Data Processing Agreement
- **SEO optimized** — Open Graph tags, canonical URLs, sitemap-ready
- **Build-time config** — Environment variables injected at build time via `scripts/generate-config.js`
- **Custom domain ready** — Canonical and OG tags target `kramaai.com`

## Project Structure

```
KramaAI/
├── index.html              # Marketing homepage
├── schedule.html           # Scheduling / demo booking page
├── styles.css              # All styling and layout
├── script.js               # Navigation, FAQ, forms, schedule links
├── config.js               # Generated at build (gitignored)
├── config.example.js       # Template for local development
├── scripts/
│   └── generate-config.js  # Writes config.js from environment variables
├── legal/
│   ├── terms.html          # Terms of Service
│   ├── privacy.html        # Privacy Policy
│   └── data-processing.html # DPA
├── assets/                 # Images and static assets
├── vercel.json             # Rewrites and static hosting config
└── package.json            # Build scripts
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm

### Installation

```bash
npm install
```

### Configuration

Copy the example config and fill in your keys:

```bash
cp config.example.js config.js
```

Or generate config from environment variables:

```bash
# Windows
$env:WEB3FORMS_ACCESS_KEY="your-key"; npm run build

# Linux/Mac
WEB3FORMS_ACCESS_KEY="your-key" npm run build
```

### Development

```bash
npm run start
```

Visit [http://localhost:3000](http://localhost:3000)

## Environment Variables

Set these in Vercel (Settings → Environment Variables) or locally:

| Variable | Purpose |
|----------|---------|
| `WEB3FORMS_ACCESS_KEY` | Contact form delivery ([web3forms.com](https://web3forms.com)) |
| `SCHEDULE_CALL_URL` | Calendly / Cal.com booking URL for "Book a demo" buttons |
| `SITE_URL` | Canonical base, e.g. `https://www.kramaai.com` |
| `CONTACT_EMAIL` | Default `hello@kramaai.com` for mailto links |
| `LINKEDIN_URL` | Optional; footer hidden if empty |
| `INSTAGRAM_URL` | Optional |
| `TWITTER_URL` | Optional |

## Deployment

### Vercel

1. Import the repository in Vercel
2. Keep the default static output (root directory)
3. Ensure Build Command is `npm run build`
4. Set environment variables (see above)
5. Deploy

### Custom Domain

1. In Vercel: Project → Settings → Domains → add `kramaai.com` and `www.kramaai.com`
2. Point DNS at Vercel per their instructions
3. Set `SITE_URL=https://www.kramaai.com` in environment variables
4. Canonical and Open Graph tags in `index.html` already target `https://www.kramaai.com/`

## Pre-Demo Checklist

- [ ] Calendar — Set `SCHEDULE_CALL_URL`, click "Book a demo" → external scheduler opens
- [ ] Contact form — Submit test from CTA section; confirm email in Web3Forms inbox
- [ ] Legal pages — Footer links open Terms, Privacy, and Data Processing pages
- [ ] Domain — Confirm production loads on custom domain with valid TLS
