import { createDbClient } from '../../../shared/db.js'
import type { ServerName } from '../../../shared/types.js'

const { realmAppId: appId } = useRuntimeConfig()

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