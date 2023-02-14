import { ServerName } from "../shared/types.js";

export const STATUS_URLS: Record<ServerName, string> = {
  east: 'https://serverstatus-sgp.albiononline.com/',
  west: 'https://serverstatus.albiononline.com/',
} as const