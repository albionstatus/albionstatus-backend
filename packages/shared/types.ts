import { z } from 'zod'

export const serverNameSchema = z.enum(['east', 'west'])
export type ServerName = z.infer<typeof serverNameSchema>;

export type StatusType = 'online' | 'offline' | 'starting' | 'unknown'
export type Status = {
  type: StatusType
  message: string,
  comment?: string
}