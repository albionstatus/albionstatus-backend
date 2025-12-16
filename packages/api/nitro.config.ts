import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
  serverDir: './',
  preset: 'cloudflare_module',
  compatibilityDate: '2025-12-16',
  routeRules: {
    '/**': {
      cors: true,
      headers: { 'access-control-allow-methods': 'GET' }
    }
  },
  runtimeConfig: {
    // Only used in development
    // CF ENV variable handling used in prod
    mongoDbUri: ''
  },
});
