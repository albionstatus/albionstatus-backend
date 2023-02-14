import { ServerName, Status } from "../shared/types.js"
import { createDbClient } from "../shared/db.js"
import { $fetch } from "ofetch"
import { STATUS_URLS } from "./constants.js"
import { FAILING_STATUS } from "../shared/constants.js"

export async function scrape (server: ServerName) {
  console.debug('Start scraping')

  const { insertStatus, getLastStatus } = await createDbClient({
    connection: process.env.MONGO_CONNECTION,
    database: process.env.MONGO_DATABASE,
    server
  })

  const [currentStatus, lastStatus] = await Promise.all([
    getCurrentStatus(server),
    getLastStatus()
  ])

  await insertStatus(currentStatus)
  console.debug('Inserted status')

  const didStatusUpdate = areStatusesDifferent(currentStatus, lastStatus)
  return { didStatusUpdate, currentStatus }
}

function areStatusesDifferent (currentStatus: Status, lastStatus?: Status) {
  if (!lastStatus) {
    return false
  }

  return JSON.stringify(currentStatus) !== JSON.stringify(lastStatus)
}

export async function getCurrentStatus (server: string): Promise<Status> {
  try {
    const [{ status, message }, _maintenanceMessage] = await Promise.all([
      $fetch(STATUS_URLS[server], { responseType: 'json' }),
      // getMaintenanceStatus()
    ])
    console.debug(`Have current status here: ${status} ${message}`)
    return {
      // type: sanitizeStatus(status),
      // message: sanitizeMessage(message, maintenanceMessage)
    }
  } catch (e) {
    console.error('Could not fetch current server status')
    console.error(e)
    return FAILING_STATUS
  }
}

// function sanitizeStatus (status: string) {
//   const STATUS_OFFLINE_VALUES = [500, '500']

//   return STATUS_OFFLINE_VALUES.includes(status) ? 'offline' : status
// }

// async function getMaintenanceStatus () {
//   try {
//     const status = await getDataAndSanitize(URLS.MAINTENANCE)
//     return status.message.includes('maintenance') ? status.message : undefined
//   } catch (e) {
//     return undefined
//   }
// }

// function sanitizeMessage (rawMessage: string, maintenanceMessage?: string) {
//   const lowerMessage = rawMessage.toLowerCase()

//   const isOnline = lowerMessage.includes('is online')

//   if (isOnline) {
//     return lowerMessage
//   }

//   if (maintenanceMessage) {
//     return maintenanceMessage.toLowerCase()
//   }

//   const isTimeout = TIMEOUT_INDICATORS.some(s => lowerMessage.includes(s))
//   return isTimeout ? MESSAGES.timeout : lowerMessage
// }

/*

const data = await $fetch(URL, {
  responseType: 'json'
})
*/