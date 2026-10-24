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

## Admin

The leadership page has a Google sign-in that lets allowlisted admins approve, unapprove, and delete testimonials. Create an OAuth 2.0 Web client ID in Google Cloud Console with `https://kykeon.church` as an authorized JavaScript origin. Put the client ID in `hugo.toml` (`googleClientId`) and also set it as the Pages variable `GOOGLE_CLIENT_ID`. Set the Pages variable `ADMIN_EMAILS` to a comma-separated list of admin Google addresses. The functions verify the ID token server-side on every request.

## Daily Report

`scripts/cron-member-report.sh` runs `scripts/member-report.ts`, which prints a change in the number of members and the count of testimonials pending evaluation, and prints nothing otherwise, so cron mails only when there is news. Output is also appended to `~/.cache/kykeon/member-report.log`. Pass `--force` to print the current counts regardless. It queries D1 through the Cloudflare REST API with credentials from `~/.config/kykeon/d1-credentials`, which must export `D1_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and `D1_KYKEON_ID`. Add it with `crontab -e`:

```
0 8 * * * /home/joshua/kykeon/scripts/cron-member-report.sh
```

## Art References

https://medium.com/@noopurshalini/ancient-decorative-motifs-of-greek-architecture-2df386b8eb74

## Copyright

© 2026 Joshua N. Pritikin. All rights reserved.

It is my intention to gift this work, including its copyright, to Matt Stahl.
