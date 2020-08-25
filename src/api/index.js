const { send } = require('micro')
const microCors = require('micro-cors')

const { mysql: mysqlConfig } = require('../shared/config.json')
const { GET_LAST_STATUS, createConnection } = require('../shared/queries')

const cors = microCors({ allowMethods: ['GET'] })

const NodeCache = require('node-cache')
const cache = new NodeCache({ stdTTL: 10, checkperiod: 20 })

const main = async (request, response) => {
  const connection = await createConnection(mysqlConfig)

  if (request.url.startsWith('/current')) {
    return current(connection, response)
  }

  if (request.url.includes('/?timestamp=')) {
    const [, urlTimestamp] = request.url.split('/?timestamp=')
    const timestamp = decodeURI(urlTimestamp)
    return byTimestamp(connection, timestamp, response)
  }

  send(response, 400, 'Bad Request')
}

const current = async (connection, response) => {
  const possibleCacheHit = cache.get('current')

  if (possibleCacheHit) {
    return sendResp(response)(possibleCacheHit)
  }

  try {
    const { result, error } = await wrapAsync(connection.query(GET_LAST_STATUS))
    if (error) {
      return sendErrorResp(response)(error)
    }
    const [rows] = result
    const [entry] = rows
    const { created_at: createdAt } = entry

    const addMinutes = require('date-fns/addMinutes')
    const setSeconds = require('date-fns/setSeconds')
    const nextMinuteDate = setSeconds(addMinutes(new Date(createdAt), 1), 0)

    const ttlInMs =  nextMinuteDate - new Date()
    const ttlInSeconds = ttlInMs / 1000
    cache.set('current', rows, ttlInSeconds)

    sendResp(response)(rows)
  } catch (e) {
    sendErrorResp(response)(e)
  }

  await connection.end()
}

const byTimestamp = async (connection, timestamp, response) => {
  const isTimestampValid = typeof timestamp !== 'undefined' && !isNaN(Date.parse(timestamp))

  if (!isTimestampValid) {
    return
  }

  const query = `SELECT created_at, current_status, message, comment FROM status WHERE created_at >= ? ORDER BY created_at DESC`
  try {
    const { result, error } = await wrapAsync(connection.query(query, [timestamp]))
    if (error) {
      return sendErrorResp(response)(error)
    }
    const [rows] = result
    sendResp(response)(rows)
  } catch (e) {
    sendErrorResp(response)(e)
  }
  await connection.end()
}

const wrapAsync = (promise) => {
  return promise
    .then(result => ({ result }))
    .catch(error => Promise.resolve({ error }))
}

const sendResp = response => result => send(response, 200, result)
const sendErrorResp = response => (e) => {
  console.error(e)
  send(response, 500, 'Internal Server Error')
}

module.exports = cors(main)
