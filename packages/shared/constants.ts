import type { ServerName, Status } from './types.js'

export const URLS: {
  STATUS: Record<ServerName, string>
} = {
  STATUS: {
    was: 'http://serverstatus.albiononline.com/',
    sgp: 'http://serverstatus-sgp.albiononline.com/',
    ams: 'http://serverstatus-sgp.albiononline.com/'
  },
}

export const SERVER_TO_DB: Record<ServerName, string> = {
  was: 'server_west',
  sgp: 'server_east',
  ams: 'server_ams',
}

export const HEADERS = {
  'User-Agent': `AlbionStatus Bot @ albionstatus.com`
}
export const FAILING_STATUS: Status = {
  type: 'unknown',
  message: 'AlbionStatus couldn\'t fetch status. Likely there is a maintenance going on',
  comment: 'Could not fetch status.'
}

export const TIMEOUT_INDICATORS = ['connect timed out', 'read timed out']

export const MESSAGES = {
  timeout: 'Server timed out'
}
