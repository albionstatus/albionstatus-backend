import { SERVER_NAMES } from "../../shared/types.js"

export default defineEventHandler((event) => {
  const { server } = event.context.params
  const isValidServer = SERVER_NAMES.includes(server)
  if(!isValidServer) {
    throw createError({
      status: 400,
      message: 'bad request'
    })
  }
})