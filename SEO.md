# Search setup

Canonical origin: https://www.unleaf.lol (the apex domain currently redirects here).

Public URLs: `/`, `/guide`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`.

The homepage supplies WebSite and WebApplication structured data. The guide supplies visible, server-rendered product information, commands, export instructions, and limitations. The optional llms.txt file is a factual directory, not a ranking guarantee. No fabricated reviews or keyword stuffing are used.

## Owner actions after deployment

- Verify a domain property for unleaf.lol in Google Search Console using the DNS value Google provides.
- Submit https://www.unleaf.lol/sitemap.xml and inspect the homepage and guide URLs for indexing.
- Add the site and sitemap to Bing Webmaster Tools.
- Check Search Console's Core Web Vitals and indexing reports as real traffic accumulates. Track queries, impressions, and clicks rather than assuming metadata changes guarantee rankings.
- Run PageSpeed Insights on desktop and mobile for both pages. The public API returned HTTP 429 during this audit, so no Lighthouse or Core Web Vitals score is claimed.
- Keep documented features and limitations accurate as the editor evolves. Add guides only when they answer real user questions.

## Verification performed

- Live apex domain redirects to www; www returns HTTP 200.
- Social image returns HTTP 200 and image/png to a Twitterbot user agent.
- Production build passes; homepage and guide contain correct, distinct canonical tags.
- Robots allows crawling and points to the canonical sitemap.
- Guide is rendered in server HTML and linked from the editor.

Search rankings and AI citations depend on indexing, usefulness, independent references, and other external factors. They cannot be guaranteed by code changes.
