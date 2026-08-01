/**
 * PLAG Ministries — Geo-routing Worker
 *
 * This is the ONLY piece of "server" logic in the whole project. It runs on
 * Cloudflare's free Workers tier, sits in front of the plain static site
 * hosted on GitHub Pages, and does exactly one job: when someone requests
 * /give.html, look at their country (from Cloudflare's edge network) and
 * return the Philippines donor page if they're in the Philippines, or the
 * USA donor page for everyone else (the default) — while the browser still
 * shows a clean /give.html URL either way.
 *
 * Every other request (homepage, images, terms, privacy, etc.) passes
 * straight through to GitHub Pages untouched.
 *
 * Deploy: see cloudflare-worker/README.md in this folder.
 */

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === '/give.html' || url.pathname === '/give' || url.pathname === '/give/') {
      const country = (request.cf && request.cf.country) || 'US';
      const target = country === 'PH' ? '/give-ph.html' : '/give-usa.html';

      const originUrl = new URL(target, url.origin);
      const originResponse = await fetch(originUrl.toString(), {
        headers: request.headers,
      });

      // Return the origin's HTML for the correct region, but keep the
      // response otherwise as-is (status, content-type, etc.)
      const response = new Response(originResponse.body, originResponse);
      response.headers.set('Cache-Control', 'private, no-store');
      return response;
    }

    // Everything else: pass through to GitHub Pages unchanged.
    return fetch(request);
  },
};
