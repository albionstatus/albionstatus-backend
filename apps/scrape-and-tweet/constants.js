module.exports.URLS = {
  STATUS: 'http://serverstatus.albiononline.com/',
  MAINTENANCE: 'http://live.albiononline.com/status.txt'
}

const pkg = require('../src/package.json')
const { version } = pkg

module.exports.HEADERS = {
  'User-Agent': `AlbionStatus Bot @ albionstatus.com, Version: ${version}`
}
module.exports.FAILING_STATUS = {
  currentStatus: 'unknown',
  message: 'AlbionStatus couldn\'t fetch status. Likely there is a maintenance going on',
  comment: 'Could not fetch status.'
}

module.exports.TIMEOUT_INDICATORS = ['connect timed out', 'read timed out']

module.exports.MESSAGES = {
  timeout: 'Server timed out'
}
