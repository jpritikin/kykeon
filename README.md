# Kykeon Church

Static site for [kykeon.church](https://kykeon.church), built with [Hugo](https://gohugo.io) and hosted on Cloudflare Pages. Signups and testimonials are stored in Cloudflare D1 via Pages Functions.

## Development

```
npm run dev
```

The signup and testimonial forms need Cloudflare Functions and don't work locally.

## Deployment

Connect the repository to Cloudflare Pages with build command `hugo --minify` and output directory `public`. Bind a D1 database as `DB` and run `migrations/0001_init.sql` in it.

## Copyright

© 2026 Joshua Pritikin. All rights reserved.

It is my intention to gift this work, including its copyright, to Matt Stahl.
