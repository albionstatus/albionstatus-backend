const fastify = require('fastify')({ ignoreTrailingSlash: true })

const { mysql: mysqlConfig } = require('../shared/config.json')
const { GET_LAST_STATUS } = require('../shared/queries')

const NodeCache = require('node-cache')
const cache = new NodeCache({ stdTTL: 10, checkperiod: 20 })

const wrapAsync = (promise) => {
  return promise
    .then(result => ({ result }))
    .catch(error => Promise.resolve({ error }))
}

const sendErrorResp = response => (e) => {
  console.error(e)
  response.code(500).send('Internal Server Error')
}

fastify.register(require('fastify-mysql'), {
  promise: true,
  ...mysqlConfig,
  host: mysqlConfig.host || 'db',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
})
fastify.register(require('fastify-cors'), {})

fastify.get('/', async (request, response) => {
  if (!request.url.includes('/?timestamp=')) {
    return response.code(400).send('Bad Request')
  }

  const [, urlTimestamp] = request.url.split('/?timestamp=')
  const timestamp = decodeURI(urlTimestamp)

  const isTimestampValid = typeof timestamp !== 'undefined' && !isNaN(Date.parse(timestamp))
  if (!isTimestampValid) {
    return
  }

  const query = `SELECT created_at, current_status, message, comment FROM status WHERE created_at >= ? ORDER BY created_at DESC`
  try {
    const { result, error } = await wrapAsync(fastify.mysql.query(query, [timestamp]))
    if (error) {
      return sendErrorResp(response)(error)
    }
    const [rows] = result
    return rows
  } catch (e) {
    return sendErrorResp(response)(e)
  }
})
fastify.get('/current/', async (_, response) => {
  const possibleCacheHit = cache.get('current')

  if (possibleCacheHit) {
    return possibleCacheHit
  }

  try {
    const { result, error } = await wrapAsync(fastify.mysql.query(GET_LAST_STATUS))

    if (error) {
      return sendErrorResp(response)(error)
    }
    const [rows] = result
    const [entry] = rows
    const { created_at: createdAt } = entry

    const addMinutes = require('date-fns/addMinutes')
    const setSeconds = require('date-fns/setSeconds')
    const nextMinuteDate = setSeconds(addMinutes(new Date(createdAt), 1), 0)

    const ttlInMs = nextMinuteDate - new Date()
    const ttlInSeconds = ttlInMs / 1000
    cache.set('current', rows, ttlInSeconds)

    return rows
  } catch (e) {
    sendErrorResp(response)(e)
  }
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000, '0.0.0.0')
    fastify.log.info(`Server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
