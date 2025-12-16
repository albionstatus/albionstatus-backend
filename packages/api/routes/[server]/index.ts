import { createDbClient } from '../../../shared/db.js'
import type { ServerName } from '../../../shared/types.js'

const { mongoUri: rawMongoUri } = useRuntimeConfig()
// @ts-expect-error NITRO_MONGODB_URI is injected by Cloudflare Workers
const mongoUri = rawMongoUri || NITRO_MONGODB_URI as string

export default defineCachedEventHandler(async (event) => {
  const { server } = event.context.params

  const { getLastStatus } = await createDbClient({
    mongoUri,
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