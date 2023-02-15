import { createDbClient } from '../../../shared/db.js'
import type { ServerName } from '../../../shared/types.js'

const { mongodbConnection } = useRuntimeConfig()

export default defineCachedEventHandler(async (event) => {
  const { server } = event.context.params

  const { getLastStatus, close } = await createDbClient({
    connection: mongodbConnection,
    database: 'albionstatus',
    server: server as ServerName
  })

  try {
    const result = await getLastStatus()
    await close()

    return result
  } catch (e) {
    throw createError('Could not get last status', 500, e)
  }
}, {
  swr: true,
  maxAge: 30,
  staleMaxAge: 60
})