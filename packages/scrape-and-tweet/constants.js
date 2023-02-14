import { version } from '../../package.json'
export const URLS = {
  STATUS: {
    west: 'http://serverstatus.albiononline.com/',
    east: 'http://serverstatus-sgp.albiononline.com/'
  }
}

export const HEADERS = {
  'User-Agent': `AlbionStatus Bot @ albionstatus.com, Version: ${version}`
}
export const FAILING_STATUS = {
  currentStatus: 'unknown',
  message: 'AlbionStatus couldn\'t fetch status. Likely there is a maintenance going on',
  comment: 'Could not fetch status.'
}

export const TIMEOUT_INDICATORS = ['connect timed out', 'read timed out']

export const MESSAGES = {
  timeout: 'Server timed out'
}
