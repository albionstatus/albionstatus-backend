import { subWeeks } from 'date-fns'
import { createDbClient } from '../../../../shared/db.js'
import type { ServerName } from '../../../../shared/types.js'
import { HTTPError } from 'nitro/h3'
import { validateServer } from '../../../utils/server.js'
import { useRuntimeConfig } from "nitro/runtime-config";
import { defineCachedHandler } from 'nitro/cache'
const { mongodbUri: rawMongoDbUri } = useRuntimeConfig()
// @ts-expect-error NITRO_MONGODB_URI is injected by Cloudflare Workers
const mongoUri = rawMongoDbUri || NITRO_MONGODB_URI as string

export default defineCachedHandler(async (event) => {
  const { server } = event.context.params

  validateServer(server)

  const timestamp = subWeeks(new Date(), 1)

  const { getPastStatuses } = await createDbClient({
    mongoUri,
    server: server as ServerName
  })

  const result = await getPastStatuses(new Date(timestamp))
  if (!result) {
    throw new HTTPError({
      message: 'No past statuses found',
      status: 400
    })
  }

  return result
}, {
  swr: true
})
