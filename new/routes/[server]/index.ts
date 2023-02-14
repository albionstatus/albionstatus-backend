export default defineEventHandler(async (event) => {
  const { server } = event.context.params
  
  // Cache keys: server, only last minute
  // On cache hit, take the cached version
  // Get last status
  // Return it
  // Save to cache



  // const possibleCacheHit = cache.get('current')

  // if (possibleCacheHit) {
  //   return possibleCacheHit
  // }

  // try {
  //   const { result, error } = await wrapAsync(fastify.mysql.query(GET_LAST_STATUS))

  //   if (error) {
  //     return sendErrorResp(response)(error)
  //   }
  //   const [rows] = result
  //   const [entry] = rows
  //   const { created_at: createdAt } = entry

  //   const addMinutes = require('date-fns/addMinutes')
  //   const setSeconds = require('date-fns/setSeconds')
  //   const nextMinuteDate = setSeconds(addMinutes(new Date(createdAt), 1), 0)

  //   const ttlInMs = nextMinuteDate - new Date().getTime()
  //   const ttlInSeconds = ttlInMs / 1000
  //   cache.set('current', rows, ttlInSeconds)

  //   return rows
  // } catch (e) {
  //   sendErrorResp(response)(e)
  // }
})