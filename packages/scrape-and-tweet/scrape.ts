import { ServerName, Status, StatusType } from "../shared/types.js"
import { createDbClient } from "../shared/db.js"
import { $fetch } from "ofetch"
import { FAILING_STATUS, MESSAGES, TIMEOUT_INDICATORS } from "../shared/constants.js"
import { STATUS_URLS } from "./constants.js"
import consola from 'consola'

export async function scrape (server: ServerName) {
  const logger = consola.withScope(`scraper-${server}`)
  logger.info(`Start scraping`)
  const { insertStatus, getLastStatus } = await createDbClient({
    appId: process.env.REALM_APP_ID,
    apiKey: process.env.REALM_API_KEY,
    server
  })

  const [currentStatus, lastStatus] = await Promise.all([
    getCurrentStatus(server),
    getLastStatus()
  ])

  await insertStatus(currentStatus)
  logger.info('Inserted status')


  const didStatusUpdate = areStatusesDifferent(currentStatus, lastStatus)
  return { didStatusUpdate, currentStatus }
}

function areStatusesDifferent (currentStatus: Status, lastStatus?: Status) {
  if (!lastStatus) {
    return false
  }

  return JSON.stringify(currentStatus) !== JSON.stringify(lastStatus)
}

type ServerStatusResponse = {
  status: string
  message: string
}

export async function getCurrentStatus (server: string): Promise<Status> {
  const logger = consola.withScope(`scraper-${server}`)

  try {
    const { status, message } = await $fetch<ServerStatusResponse>(STATUS_URLS[server], { responseType: 'json' })
    logger.info(`Have current status here: ${status} ${message}`)
    return {
      type: sanitizeStatus(status) as StatusType,
      message: sanitizeMessage(message)
    }
  } catch (e) {
    logger.error('Could not fetch current server status')
    logger.error(e)
    return FAILING_STATUS
  }
}

function sanitizeStatus (status: string) {
  const STATUS_OFFLINE_VALUES = [500, '500']

  return STATUS_OFFLINE_VALUES.includes(status) ? 'offline' : status
}

function sanitizeMessage (rawMessage: string) {
  const lowerMessage = rawMessage.toLowerCase()

  const isOnline = lowerMessage.includes('is online')

  if (isOnline) {
    return lowerMessage
  }

  const isTimeout = TIMEOUT_INDICATORS.some(s => lowerMessage.includes(s))
  return isTimeout ? MESSAGES.timeout : lowerMessage
}