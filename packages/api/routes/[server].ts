import { serverNameSchema } from "../../shared/types.js"

export default defineEventHandler((event) => {
  const { server } = event.context.params
  const result = serverNameSchema.safeParse(server)
  if(!result.success) {
    throw createError({
      status: 400,
      message: 'bad request'
    })
  }
})