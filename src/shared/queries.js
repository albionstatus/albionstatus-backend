module.exports.GET_LAST_STATUS = 'SELECT created_at, current_status, message, comment FROM status ORDER BY created_at DESC LIMIT 1'
