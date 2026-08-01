# PLAG Ministries — Website

Plain HTML, CSS, and vanilla JavaScript. No framework, no build step —
what you see in this folder is exactly what gets served.

## Why this structure

Every `.html` file is fully self-contained — CSS and JavaScript are inlined
directly into each page (no external `.css`/`.js` files to load), and every
internal link is relative. That means the site renders correctly whether
you double-click a file to open it straight in a browser, run it through a
local server, or deploy it on GitHub Pages — no path or loading issues
depending on how it's opened.

- **`index.html`** — the one-page homepage.
- **`give.html`** — the public donate link (`/give.html`). By default this
  is just a copy of the USA giving page, so the site works correctly on
  GitHub Pages alone, with everyone defaulting to USD.
- **`give-usa.html`** / **`give-ph.html`** — the two actual regional donor
  pages. These aren't linked from anywhere in the site's navigation.
- **`cloudflare-worker/`** — one small, free Cloudflare Worker that (once
  set up) intercepts requests to `/give.html` and serves `give-ph.html`'s
  content to Philippines visitors and `give-usa.html`'s content to everyone
  else — invisibly, at the same URL. This is the only piece that isn't
  "plain static files," because genuinely restricting what content reaches
  a visitor's browser based on location requires something running at the
  edge — GitHub Pages alone can't do that part. See
  `cloudflare-worker/README.md` for the 10-minute setup.

One tradeoff of inlining: the same CSS is repeated in every page rather
than shared from one file. That's a deliberate choice for reliability over
elegance, given there's no build step to share it safely. If you ever add a
build tool later, that CSS can move back into one shared file.

## One-time setup

1. **Push to GitHub:**
   ```sh
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/plag-ministries.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:** repo → Settings → Pages → Source: "Deploy from
   branch" → branch `main`, folder `/ (root)`. Save. GitHub will give you a
   `https://<username>.github.io/<repo>/` URL — that already works, no
   build step, no Actions workflow needed.

3. **Point your domain at it:** repo → Settings → Pages → add
   `www.plagministries.org` as a custom domain, and follow GitHub's DNS
   instructions (a CNAME record, usually).

4. **Fill in your real Donorbox campaign slugs** — open `give-usa.html` and
   `give-ph.html` and replace `REPLACE_USA_SLUG` / `REPLACE_PH_SLUG` with
   the part of your campaign URL after `donorbox.org/`.

5. **(Recommended) Set up the geo-routing Worker** — see
   `cloudflare-worker/README.md`. Skipping this step is safe: the site
   still works, everyone just sees the USA giving page by default.

From then on: edit any `.html` file directly, `git push`, and GitHub Pages
updates automatically within a minute or two. No servers, no hosting bill,
no build errors.

## Local preview

No install needed — any simple static server works, e.g.:
```sh
npx serve .
```
or, with Python:
```sh
python3 -m http.server 8080
```
Then open `http://localhost:8080`.

Note: locally, `/give.html` always shows the USA version — the Philippines
routing only happens once the Cloudflare Worker is live in front of your
real domain.

## Design notes

Palette and iconography are drawn directly from the official PLAG
Ministries logo — deep navy sky, cream dove, soft plum crescent, warm gold
path — rather than any one theme from the book. A quiet trail (`.rail` /
`.marker` in `styles.css`) connects each homepage section, echoing the
winding path toward the cross in the logo. Type: Fraunces (display),
Courier Prime (small labels), Public Sans (body text).
