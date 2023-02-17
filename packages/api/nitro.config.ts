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
    realmAppId: ''
  }
});
