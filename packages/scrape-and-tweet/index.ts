import { scrape } from "./scrape.js"
import { tweet } from "./tweet.js"
import type { ServerName } from '../shared/types.js'

async function scrapeAndTweet (server: ServerName) {
  const { didStatusUpdate, currentStatus } = await scrape(server)

  if (!didStatusUpdate) {
    console.log("Status did not update")
    process.exit()
  }

  // Do not tweet yet to avoid double tweets
  // await tweet({ status: currentStatus, server })
}

const result = await Promise.allSettled([
  scrapeAndTweet('east'),
  scrapeAndTweet('west')
])

if (!result.every(({ status }) => status === 'fulfilled')) {
  console.error('At least one scraper failed')
  console.error(result)
}

