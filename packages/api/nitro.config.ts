import { defineNitroConfig } from "nitropack-edge";

export default defineNitroConfig({
  preset: 'cloudflare',
  routeRules: {
    '/**': {
      cors: true,
      headers: { 'access-control-allow-methods': 'GET' }
    }
  },
  runtimeConfig: {
    // Only used in development
    // CF ENV variable handling used in prod
    realmAppId: ''
  },
  // https://github.com/realm/realm-js/pull/5452
  replace: {
    'process.release.name': '""',
    'process.versions.node': '""'
  }
});
