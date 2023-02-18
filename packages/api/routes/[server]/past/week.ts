import { createDbClient } from '../../../../shared/db.js'
import type { ServerName } from '../../../../shared/types.js'

const { realmAppId: rawAppId } = useRuntimeConfig()
// @ts-expect-error NITRO_REALM_APP_ID is injected by Cloudflare Workers
const appId = rawAppId || NITRO_REALM_APP_ID as string

export default defineCachedEventHandler(async (event) => {
  const { server } = event.context.params

  const timestamp = new Date().getTime() - 604800000

  const { getPastStatuses } = await createDbClient({
    appId,
    server: server as ServerName
  })

  const result = await getPastStatuses(new Date(timestamp))
  if (!result) {
    throw createError('No past statuses found', 400)
  }

  return result
}, {
  swr: true
})
