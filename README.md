# Unleaf

Less overhead. More paper. **Unleaf** is a lightweight, no-login LaTeX workspace built with Next.js. Write research papers with a live preview, keep drafts locally in your browser, and export the rendered pages as a PDF. Its new home is [unleaf.lol](https://unleaf.lol)—domain connection pending. The existing deployment remains at [latex-boi.vercel.app](https://latex-boi.vercel.app/).

Run locally with `npm install` and `npm run dev`. Run regression tests with `npm test` and verify the production build with `npm run build`.

The preview uses a browser-based LaTeX renderer, not a full TeX compiler; arbitrary packages are not yet supported. Existing drafts remain compatible with the previous LatexBoi storage keys on the same origin. Browser drafts do not transfer automatically between domains: copy your source before switching to unleaf.lol.

## Domain setup

Add `unleaf.lol` to the existing Vercel project's domains and configure the DNS records Vercel provides. Metadata, canonical URLs, sitemap, and social previews are prepared for that domain. Configure the old deployment domain to redirect to the new domain after it is connected and verified.
