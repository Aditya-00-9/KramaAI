# KramaAI – Marketing Site

Static marketing homepage for **KramaAI BMS** — vertical business management + AI for gyms, kids centers, studios, and spas.

## Project structure

- `index.html` – Homepage
- `schedule.html` – Dedicated scheduling page (`/schedule` via Vercel rewrite)
- `legal/` – Terms, Privacy, and Data Processing pages
- `styles.css` – Layout and design
- `script.js` – Navigation, FAQ, forms, schedule links
- `config.js` – Generated at build (gitignored); holds secrets and URLs
- `scripts/generate-config.js` – Writes `config.js` from environment variables
- `vercel.json` – Rewrites and static hosting

## Running locally

```bash
npm install
# Copy config.example.js to config.js and fill in keys, OR:
$env:WEB3FORMS_ACCESS_KEY="your-key"; npm run build
npm run start
```

Visit `http://localhost:3000`.

## Environment variables (Vercel)

Set these in the Vercel project **Settings → Environment Variables** (Production & Preview):

| Variable | Purpose |
|----------|---------|
| `WEB3FORMS_ACCESS_KEY` | Contact form delivery ([web3forms.com](https://web3forms.com)) |
| `SCHEDULE_CALL_URL` | Calendly / Cal.com booking URL for all “Book a demo” buttons |
| `SITE_URL` | Canonical base, e.g. `https://www.kramaai.com` |
| `CONTACT_EMAIL` | Default `hello@kramaai.com` for mailto links |
| `LINKEDIN_URL` | Optional; footer hidden if empty |
| `INSTAGRAM_URL` | Optional |
| `TWITTER_URL` | Optional |

Vercel runs `npm run build` before deploy, which generates `config.js`.

## Custom domain

1. In Vercel: **Project → Settings → Domains** → add `kramaai.com` and `www.kramaai.com`.
2. Point DNS at Vercel per their instructions.
3. Set `SITE_URL=https://www.kramaai.com` in environment variables.
4. Canonical and Open Graph tags in `index.html` already target `https://www.kramaai.com/`.

## Deploying to Vercel

Import the repo, keep the default static output (root directory), and ensure **Build Command** is `npm run build` (from `package.json`). No framework preset required.

## End-to-end checks before buyer demos

1. **Calendar** – Set `SCHEDULE_CALL_URL`, click “Book a demo” → external scheduler opens.
2. **Contact form** – Submit test from `#cta`; confirm email in Web3Forms inbox.
3. **Legal** – Footer links open `legal/terms.html`, `legal/privacy.html`, `legal/data-processing.html`.
4. **Domain** – Confirm production loads on custom domain with valid TLS.
