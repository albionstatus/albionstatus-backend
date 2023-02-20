
import { scrape } from "./scrape.js"
import { tweet } from "./tweet.js"
import type { ServerName } from '../shared/types.js'
import { Env } from "./types.js"

export default {
	async scheduled (
		controller: ScheduledController,
		env: Env,
		ctx: ExecutionContext
	): Promise<void> {
		const result = await Promise.allSettled([
			scrapeAndTweet('east', env),
			scrapeAndTweet('west', env)
		])

		if (!result.every(({ status }) => status === 'fulfilled')) {
			console.error('At least one scraper failed')
			console.error(result)
		}
	}
}

async function scrapeAndTweet (server: ServerName, env: Env) {
	const { didStatusUpdate, currentStatus } = await scrape(server, env)

	if (!didStatusUpdate) {
		console.log("Status did not update")
		return { success: true, message: "Status did not update" }
	}

	await tweet({ status: currentStatus, server, env })
}
