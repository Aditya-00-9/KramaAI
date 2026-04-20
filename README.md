# KramaAI – Marketing Site

Static marketing homepage for **KramaAI**, an AI-powered business management system for service-based and multi-location organizations.

## Project structure

- `index.html` – Full homepage markup (hero, problem, solution, features, financial clarity, pricing, CTA, FAQ, footer)
- `styles.css` – All layout and visual design (responsive, dark SaaS style)
- `script.js` – Mobile navigation + FAQ accordion interactions
- `package.json` – Metadata and convenience script
- `vercel.json` – Minimal Vercel configuration for static hosting

No build tools or frameworks are required – this is pure HTML/CSS/JS.

## Running locally

From `bms website` folder:

```bash
# option 1 – using the script
npm install  # installs npx if needed
npm run start

# option 2 – any static server
npx serve .
```

Then visit `http://localhost:3000` (or the port your static server reports).

## Deploying to Vercel

### Option A – via GitHub (recommended)

1. Initialize a git repo in this folder:
   ```bash
   git init
   git add .
   git commit -m "Add KramaAI marketing site"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. Go to `https://vercel.com`, sign in, and click **Add New → Project**.
3. Import your GitHub repository that contains this project.
4. Leave **Framework Preset**, **Build Command**, and **Output Directory** as default (no custom build needed for this static site).
5. Click **Deploy**. Vercel will serve `index.html` at `/` automatically.

### Option B – via Vercel CLI

1. Install the CLI (once):
   ```bash
   npm install -g vercel
   ```
2. From the `bms website` folder, run:
   ```bash
   vercel
   ```
3. Follow the prompts (project name, scope, etc.). No build command or output directory is needed; Vercel will deploy the static files in the root.

After the first deploy, you can run:

```bash
vercel --prod
```

to push new versions live after each change.

## Notes

- There is no backend or database in this repo. To wire up the contact form, connect `action` in `index.html` to your preferred form backend or API (e.g., Formspree, your own endpoint, or a serverless function).
- Because this is a static site, it is compatible with **GitHub Pages**, **Netlify**, and other static hosts as well.

