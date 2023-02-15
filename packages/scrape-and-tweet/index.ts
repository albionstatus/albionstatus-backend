import { scrape } from "./scrape.js"
import { tweet } from "./tweet.js"
import type { ServerName } from '../shared/types.js'

async function scrapeAndTweet (server: ServerName) {
  const { didStatusUpdate, currentStatus } = await scrape(server)

  if (!didStatusUpdate) {
    console.log("Status did not update")
    process.exit()
  }

  await tweet({ status: currentStatus, server })
}

await Promise.allSettled([
  scrapeAndTweet('east'),
  scrapeAndTweet('west')
])