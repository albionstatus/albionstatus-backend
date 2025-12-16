import { defineHandler } from "nitro/h3"
import { SERVER_NAMES } from "../../shared/types.js"

export default defineHandler((event) => {
  const { server } = event.context.params
  const isValidServer = SERVER_NAMES.includes(server as typeof SERVER_NAMES[number])
  if(!isValidServer) {
    throw createError({
      status: 400,
      message: 'bad request'
    })
  }
})