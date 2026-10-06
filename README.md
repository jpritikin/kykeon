# Second Church of the Kykeon

Static site for [kykeon.church](https://kykeon.church), built with [Hugo](https://gohugo.io) and hosted on Cloudflare Pages. Signups and testimonials are stored in Cloudflare D1 via Pages Functions.

## Development

```
npm run dev
```

The signup and testimonial forms need Cloudflare Functions and don't work locally.

## Deployment

Connect the repository to Cloudflare Pages with build command `npm run build` (typechecks, then runs `hugo --minify`) and output directory `public`. Bind a D1 database as `DB` and run `migrations/0001_init.sql` in it.

Create a Cloudflare Turnstile widget for kykeon.church. Put its site key in `hugo.toml` (`turnstileSiteKey`) and add its secret key as the Pages secret `TURNSTILE_SECRET`.

## Copyright

© 2026 Joshua N. Pritikin. All rights reserved.

It is my intention to gift this work, including its copyright, to Matt Stahl.
