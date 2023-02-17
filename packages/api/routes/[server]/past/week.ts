import { createDbClient } from '../../../../shared/db.js'
import type { ServerName } from '../../../../shared/types.js'

const { realmAppId: appId } = useRuntimeConfig()

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
