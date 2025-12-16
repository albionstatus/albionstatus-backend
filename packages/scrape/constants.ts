import { ServerName } from "../shared/types.js";

export const STATUS_URLS: Record<ServerName, string> = {
  sgp: 'https://serverstatus-sgp.albiononline.com/',
  ams: 'https://serverstatus-ams.albiononline.com/',
  was: 'https://serverstatus.albiononline.com/',
} as const