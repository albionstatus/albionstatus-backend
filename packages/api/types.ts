import { z } from 'zod'
export const serverNameSchema = z.enum(['east', 'west'])
export type ServerName = z.infer<typeof serverNameSchema>;