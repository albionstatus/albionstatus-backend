import { HTTPError } from 'nitro/h3'
import { createDbClient } from '../../../../shared/db.js'
import type { ServerName } from '../../../../shared/types.js'
import { subDays } from 'date-fns'
import { validateServer } from '../../../utils/server.js'
import { useRuntimeConfig } from "nitro/runtime-config";
import { defineCachedHandler } from 'nitro/cache'

export default defineCachedHandler(async (event) => {
  const { server } = event.context.params

  validateServer(server)

  const { mongodbUri: rawMongoUri } = useRuntimeConfig()
  // @ts-expect-error MONGODB_URI is injected by Cloudflare Workers
  const mongoUri = rawMongoUri || process.env.NITRO_MONGODB_URI


  const timestamp = subDays(new Date(), 1)

  const { getPastStatuses, closeConnection } = await createDbClient({
    mongoUri,
    server: server as ServerName
  })

  const result = await getPastStatuses(new Date(timestamp))
  if (!result) {
    throw new HTTPError({
      message: 'No past statuses found',
      statusCode: 400
    })
  }
  event.waitUntil(closeConnection())

  return result
}, {
  swr: true
})
