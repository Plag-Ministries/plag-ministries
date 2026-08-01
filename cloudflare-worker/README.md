# Deploying the geo-routing Worker

This Worker is what makes `/give.html` show the right country's donor page.
Without it, everyone just sees the USA page (the safe default) — nothing
breaks, you just don't get the automatic Philippines routing until this is
set up. Takes about 10 minutes, and it's free.

## Prerequisites

- Your domain's DNS must be on Cloudflare (free plan is fine). If
  `plagministries.org` isn't already using Cloudflare nameservers, Cloudflare
  will walk you through that when you add the domain — this also happens to
  be a common, free way to speed up and secure a GitHub Pages site, separate
  from anything in this repo.
- Your GitHub Pages site should already be live at your custom domain
  (`www.plagministries.org`) before doing this step.

## Option A — Cloudflare Dashboard (no command line)

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Create Worker**.
2. Give it a name, e.g. `plag-give-router`, and click **Deploy** (it'll deploy a placeholder first).
3. Click **Edit Code**, delete everything in the editor, and paste in the
   contents of `worker.js` from this folder.
4. Click **Deploy**.
5. Go to your domain in Cloudflare → **Workers Routes** (sometimes under
   the domain's **Rules** or **Workers Routes** section) → **Add route**.
   - Route: `www.plagministries.org/give.html*`
   - Worker: select `plag-give-router`
6. Save. Test by visiting `https://www.plagministries.org/give.html`.

## Option B — Wrangler CLI (if you're comfortable with a terminal)

```sh
npm install -g wrangler
wrangler login
cd cloudflare-worker
wrangler init --from-dash false   # or create wrangler.toml manually, see below
```

Minimal `wrangler.toml`:
```toml
name = "plag-give-router"
main = "worker.js"
compatibility_date = "2026-07-01"

routes = [
  { pattern = "www.plagministries.org/give.html*", zone_name = "plagministries.org" }
]
```

Then:
```sh
wrangler deploy
```

## Testing it worked

```sh
curl -s https://www.plagministries.org/give.html | grep -o "Salamat\|tax-deductible gift funds"
```
- From a USA IP, you should see the USA text.
- You can simulate the Philippines locally before going live by testing the
  Worker's logic directly (it just reads `request.cf.country`), or by asking
  a friend/contact in the Philippines to check `www.plagministries.org/give.html`
  and confirm they see the peso version.

## If something looks wrong

- Everyone seeing the USA page even from the Philippines → check the Worker
  route pattern matches your exact domain, and that the Worker is actually
  deployed with the latest `worker.js` content.
- `give.html` shows a GitHub 404 → make sure `give-usa.html` and
  `give-ph.html` were actually pushed to the repo and are live on GitHub
  Pages at those exact filenames.
