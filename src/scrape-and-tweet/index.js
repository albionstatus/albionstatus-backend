const Logger = require('./Logger.js')

const { MESSAGES, TIMEOUT_INDICATORS, URLS } = require('./constants.js')
const { GET_LAST_STATUS, createConnection } = require('../shared/queries.js')

const Config = require('../config.json')
const { mysql: mysqlConfig } = Config

async function main () {
  Logger.verbose('Starting')
  const [currentStatus, lastStatus] = await Promise.all([getCurrentStatus(), getLastStatus()])

  await insertStatus(currentStatus)
  Logger.verbose('Inserted status')

  const isNewStatus = areStatusesDifferent(currentStatus, lastStatus)

  if (!isNewStatus) {
    Logger.info('No changes detected')
    return
  }

  Logger.info(`Status changed from ${lastStatus.currentStatus} to ${currentStatus.currentStatus}`)

  /*
  const message = `New server status: ${currentStatus.currentStatus}. Message: ${currentStatus.message}`

  const Twitter = require('twit')
  const twitterClient = new Twitter(Config.twitter)

  if (message.length <= 280) {
    await tweetMessage(twitterClient, message)
    return
  }

  const truncatedMessage = `${message.slice(0, 270)}...`
  const reason = `...${message.slice(270)}`

  const messageIdToAnswer = await tweetMessage(twitterClient, truncatedMessage)
  await tweetMessage(twitterClient, reason, messageIdToAnswer)
   */
}

function sanitizeMessage (rawMessage, maintenanceMessage) {
  if (maintenanceMessage) {
    return maintenanceMessage
  }

  const lowerMessage = rawMessage.toLowerCase()
  const isTimeout = TIMEOUT_INDICATORS.some(s => lowerMessage.includes(s))
  return isTimeout ? MESSAGES.timeout : lowerMessage
}

async function insertStatus ({ currentStatus, message }) {
  const connection = await createConnection(mysqlConfig)

  const query = 'INSERT INTO `status` (current_status, message) VALUES (?, ?)'
  await connection.query(query, [currentStatus, message])
  await connection.end()
}

function areStatusesDifferent (currentStatus, lastStatus) {
  if (typeof lastStatus === 'undefined') {
    return false
  }
  return currentStatus.currentStatus !== lastStatus.currentStatus || currentStatus.message !== lastStatus.message
}

async function getCurrentStatus () {
  const [{ status, message }, maintenanceMessage] = await Promise.all([getData(URLS.STATUS), getMaintenanceStatus()])
  Logger.verbose(`Have current status here: ${status} ${message}`)
  return { currentStatus: sanitizeStatus(status), message: sanitizeMessage(message, maintenanceMessage) }
}

function sanitizeStatus (status) {
  const STATUS_OFFLINE_VALUES = [500, '500']

  return STATUS_OFFLINE_VALUES.includes(status) ? 'offline' : status
}

async function getMaintenanceStatus () {
  const status = await getDataAndSanitize(URLS.MAINTENANCE)
  return status.message.includes('maintenance') ? status.message : undefined
}

async function getLastStatus () {
  // TODO: Error handling
  Logger.verbose('Fetching last status')
  const connection = await createConnection(mysqlConfig)

  const [potentialFirstResult] = await connection.query(GET_LAST_STATUS)
  await connection.end()

  Logger.verbose('Got first result')

  if (!potentialFirstResult.length) {
    Logger.verbose('It was undefined')
    return {
      currentStatus: undefined,
      comment: 'booting up',
    }
  }

  const [{ current_status: currentStatus, message, comment }] = potentialFirstResult

  Logger.verbose(`Now we talk! ${currentStatus}`)

  return { currentStatus, message, comment }
}

async function tweetMessage (client, message, messageIdToAnswer) {
  if (process.env.NODE_ENV !== 'production') {
    Logger.verbose('Results have been updated! Not tweeting because I am not in production mode')
    return
  }
  Logger.verbose('Results have been updated! Tweeting now')

  // TODO: Don't tweet for now, just testing
  /*
  try {
    const { data } = await client.post('statuses/update', { status })

    if (data.errors) {
      Logger.error('Tweeting failed', data.errors)
      return
    }
    Logger.info('Tweeted successfully')
  } catch (e) {
    Logger.error(`Tweeting failed: ${e}`)
  }
  */
}

async function getDataAndSanitize (url) {
  const data = await getData(url)
  Logger.verbose(`Got data from ${url}, sanitizing now`)
  return sanitizeStatusData(data)
}

function sanitizeStatusData (statusString) {
  if (!statusString) {
    return {}
  }

  const sanitizedString = statusString
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
  return JSON.parse(sanitizedString)
}

async function getData (url) {
  const axios = require('axios')
  try {
    const { data } = await axios.get(url)
    return data
  } catch (err) {
    return err.response.data
  }
}

main()
