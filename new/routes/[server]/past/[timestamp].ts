
export default defineEventHandler(async (event) => {
  // if (!event.url.includes('/?timestamp=')) {
  //   return response.code(400).send('Bad Request')
  // }

  // const [, urlTimestamp] = request.url.split('/?timestamp=')
  // const timestamp = decodeURI(urlTimestamp)

  // const isTimestampValid = typeof timestamp !== 'undefined' && !isNaN(Date.parse(timestamp))
  // if (!isTimestampValid) {
  //   return
  // }

  // const query = `SELECT created_at, current_status, message, comment FROM status WHERE created_at >= ? ORDER BY created_at DESC`
  // try {
  //   const { result, error } = await wrapAsync(fastify.mysql.query(query, [timestamp]))
  //   if (error) {
  //     return sendErrorResp(response)(error)
  //   }
  //   const [rows] = result
  //   return rows
  // } catch (e) {
  //   return sendErrorResp(response)(e)
  // }
})
