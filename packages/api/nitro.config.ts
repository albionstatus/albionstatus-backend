import { defineNitroConfig } from "nitro/config";

const COMPAT_DATE = '2025-12-16';

export default defineNitroConfig({
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
  rollupConfig: {
    // @ts-expect-error Rolldown-specific config
    platform: 'node',
  }
  // THIS NEEDS PATCHES AFTER OUTPUT.
  // Rolldown runtime patch:
  // const r = createRequire('file://')
  // var __require = /* @__PURE__ */ (id, ...args) => {
  //   if(id === 'process') {
  //     return id
  //   }
  //   return r(id, ...args);
  // }

  // Then, in libs/_mongodb replace "= process.env;" with "= process.env ?? {};"
  // Then deploy!
});
