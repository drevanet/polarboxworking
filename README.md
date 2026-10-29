# Reva Box starter

Next.js 14 + React 18 + Tailwind, credentials authentication, Prisma/Neon schema, 3D box preview, six independent face uploads, pricing and policy pages, Polar checkout/webhook scaffolding.

## Setup
1. Copy `.env.example` to `.env` and fill in Neon and Polar values.
2. `npm install`
3. `npx prisma generate`
4. `npx prisma db push`
5. `npm run dev`

Generate a secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

Create Polar products for $10/month, $7 every two weeks and $98/year, then set product IDs in env. Webhook URL: `https://YOUR-DOMAIN/api/webhooks/polar`. Test using Polar sandbox.

## Production notes
This is a starter, not a production-certified app. Verify the exact installed Polar SDK version and event payloads. Add webhook idempotency, persistent object storage for images, project loading/editing, high-resolution transparent PNG rendering, password reset/email verification, rate limiting and full billing edge-case tests. The editor currently holds uploaded image data in browser state; images do not persist on refresh. The sample download endpoint increments usage before client-side canvas export, so production should account only for successful exports. Review legal pages and test deployment before accepting payments.
