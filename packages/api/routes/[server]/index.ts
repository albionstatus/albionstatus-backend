import { createDbClient } from '../../../shared/db.js'
import type { ServerName } from '../../../shared/types.js'

const { realmAppId: rawAppId } = useRuntimeConfig()
// @ts-expect-error NITRO_REALM_APP_ID is injected by Cloudflare Workers
const appId = rawAppId || NITRO_REALM_APP_ID as string

export default defineCachedEventHandler(async (event) => {
  const { server } = event.context.params

  const { getLastStatus } = await createDbClient({
    appId,
    server: server as ServerName
  })

  try {
    const result = await getLastStatus()

    return result
  } catch (e) {
    throw createError('Could not get last status', 500, e)
  }
}, {
  swr: true,
  maxAge: 30,
  staleMaxAge: 60
})