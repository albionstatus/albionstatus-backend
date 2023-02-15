import { defineNitroConfig } from "nitropack";

export default defineNitroConfig({
  preset: 'cloudflare',
  routeRules: {
    '/**': {
      cors: true,
      headers: { 'access-control-allow-methods': 'GET' }
    }
  },
  runtimeConfig: {
    mongodbConnection: ''
  }
});
