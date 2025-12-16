import { createDbClient } from '../../../../shared/db.js'
import type { ServerName } from '../../../../shared/types.js'
import { subDays } from 'date-fns'

const { mongoDbUri: rawMongoUri } = useRuntimeConfig()
// @ts-expect-error MONGODB_URI is injected by Cloudflare Workers
const mongoUri = rawMongoUri || MONGODB_URI as string

export default defineCachedEventHandler(async (event) => {
  const { server } = event.context.params

  const timestamp = subDays(new Date(), 1)

  const { getPastStatuses } = await createDbClient({
    mongoUri,
    server: server as ServerName
  })

  const result = await getPastStatuses(new Date(timestamp))
  if (!result) {
    throw createError({
      message: 'No past statuses found',
      statusCode: 400
    })
  }

  return result
}, {
  swr: true
})
