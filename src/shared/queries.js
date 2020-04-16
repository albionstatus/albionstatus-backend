const mysql = require('mysql2/promise')

module.exports.createConnection = mysqlConfig => {
  return mysql.createConnection({
    ...mysqlConfig,
    host: mysqlConfig.host || 'db'
  })
}

module.exports.GET_LAST_STATUS = 'SELECT created_at, current_status, message, comment FROM status ORDER BY created_at DESC LIMIT 1'
