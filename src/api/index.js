const { send } = require('micro')
const microCors = require('micro-cors')

const { mysql: mysqlConfig } = require('../shared/config.json')
const { GET_LAST_STATUS, createConnection } = require('../shared/queries')

const cors = microCors({ allowMethods: ['GET'] })

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
  try {
    const [rows] = await connection.query(GET_LAST_STATUS).catch(sendErrorResp(response))
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
    const [rows] = await connection.query(query, [timestamp]).catch(sendErrorResp(response))
    sendResp(response)(rows)
  } catch (e) {
    sendErrorResp(response)(e)
  }
  await connection.end()
}

const sendResp = response => result => {
  send(response, 200, result)
}
const sendErrorResp = response => () => {
  send(response, 500, 'Internal Server Error')
}

module.exports = cors(main)
