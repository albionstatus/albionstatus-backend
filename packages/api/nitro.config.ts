import { defineNitroConfig } from "nitro/config";

const COMPAT_DATE = '2025-12-16';

export default defineNitroConfig({
  errorHandler: './error.ts',
  serverDir: './',
  preset: 'cloudflare_module',
  compatibilityDate: COMPAT_DATE,
  routeRules: {
    '/**': {
      cors: true,
      headers: { 'access-control-allow-methods': 'GET' }
    }
  },
  cloudflare: {
    deployConfig: true,
    nodeCompat: true,
    wrangler: {
      name: "albionstatus-api",
      account_id: "1352b1a4f604a54c8862bec20881b0fb",
      compatibility_date: COMPAT_DATE,
      compatibility_flags: ['nodejs_compat'],
    }
  },
  runtimeConfig: {
    // Only used in development
    // CF ENV variable handling used in prod
    mongodbUri: ''
  },
});
